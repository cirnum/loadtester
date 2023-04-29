package executor

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	metrics "github.com/cirnum/strain-hub/app/executor/matrics"
	"github.com/cirnum/strain-hub/app/model"
	gometrics "github.com/rcrowley/go-metrics"
)

const (
	Idle     status = "idle"
	Running  status = "running"
	Finished status = "finished"
)

var (
	ErrIDNotFound    = errors.New("id not found")
	ErrNodeIsRunning = errors.New("driver is running")

	ErrAppCancel = errors.New("application is cancel")
	ErrAppPanic  = errors.New("application is panic")
)

type status string

type Options struct {
	AppID int
}
type unit struct {
	Title    string             // metric title
	Type     metrics.MetricType // to know the current unit type
	metricID string             // metric table foreign key
	c        gometrics.Counter
	h        gometrics.Histogram
	g        gometrics.Gauge
}

type Executor struct {
	mu    sync.Mutex
	id    string
	appID string
	status
	units map[string]unit //title - gometrics
	httpC *http.Client
}

// the singleton instance of executor
var executorInstance Executor

func getExecutor() *Executor {
	return &executorInstance
}

func init() {
	hostname, _ := os.Hostname()
	pid := os.Getpid()
	id := fmt.Sprintf("%s-%d", hostname, pid)
	executorInstance = Executor{
		id: id,
	}
}

func NewExecutor(reqId string) (e *Executor) {
	e = getExecutor()
	e.units = make(map[string]unit)
	e.appID = reqId
	e.status = Idle
	return
}

func (e *Executor) Setup(groups []metrics.Group, reqId string) error {
	// ctx := context.TODO()

	units := make(map[string]unit)

	e.mu.Lock()
	defer e.mu.Unlock()

	for _, group := range groups {
		// create a new group if not existed
		// egroup, err := e.rc.FindCreateGroup(ctx, &pb.FCGroupReq{
		// 	AppID: int64(e.appID),
		// 	Name:  group.Name,
		// })
		// if err != nil {
		// 	return fmt.Errorf("failed create group: %v", err)
		// }

		for _, graph := range group.Graphs {
			// create new graph if not existed
			// egraph, err := e.rc.FindCreateGraph(ctx, &pb.FCGraphReq{
			// 	AppID:   int64(e.appID),
			// 	Title:   graph.Title,
			// 	Unit:    graph.Unit,
			// 	GroupID: egroup.Id,
			// })
			// if err != nil {
			// 	return fmt.Errorf("failed create graph: %v", err)
			// }

			for _, m := range graph.Metrics {
				// create new metric if not existed
				// emetric, err := e.rc.FindCreateMetric(ctx, &pb.FCMetricReq{
				// 	AppID:   int64(e.appID),
				// 	Title:   m.Title,
				// 	Type:    string(m.Type),
				// 	GraphID: egraph.Id,
				// })
				// if err != nil {
				// 	return fmt.Errorf("failed create metric: %v", err)
				// }

				// counter type
				if m.Type == metrics.Counter {
					c := gometrics.NewCounter()
					if err := gometrics.Register(m.Title, c); err != nil {
						if _, ok := err.(gometrics.DuplicateMetric); ok {
							continue
						}
						return err
					}

					units[m.Title] = unit{
						Title:    m.Title,
						Type:     m.Type,
						metricID: e.appID,
						c:        c,
					}
				}

				if m.Type == metrics.Histogram {
					s := gometrics.NewExpDecaySample(1028, 0.015)
					h := gometrics.NewHistogram(s)
					if err := gometrics.Register(m.Title, h); err != nil {
						if _, ok := err.(gometrics.DuplicateMetric); ok {
							continue
						}
						return err
					}
					units[m.Title] = unit{
						Title:    m.Title,
						Type:     m.Type,
						metricID: e.appID,
						h:        h,
					}
				}

				if m.Type == metrics.Gauge {
					g := gometrics.NewGauge()
					if err := gometrics.Register(m.Title, g); err != nil {
						if _, ok := err.(gometrics.DuplicateMetric); ok {
							continue
						}
						return err
					}
					units[m.Title] = unit{
						Title:    m.Title,
						Type:     m.Type,
						metricID: e.appID,
						g:        g,
					}
				}
			}
		}
	}

	fmt.Printf(" Al uniits: %+v \n", &units)
	// aggregate units
	for k, v := range units {
		e.units[k] = v
	}

	fmt.Println("===================================")

	fmt.Printf(" eunit uniits: %+v\n", e.units)

	return nil
}

// func (e *Executor) f(ctx context.Context, vui int) {
// 	timeout := time.After(2 * time.Minute)

//		for {
//			select {
//			case <-timeout:
//				return
//			default:
//				go client.Get(ctx, url, nil)
//				dis.SleepRatePoisson(10)
//			}
//		}
//	}

func (e *Executor) Run(ctx context.Context, conf model.PayloadResponder) (err error) {

	e.status = Running

	finished := make(chan error)

	// when the runScen finished, we should stop the logScaled and systemloadRun
	// also; however, not necessary since the executor will be shutdown anyway
	go e.logScaled(ctx, 10*time.Second)

	select {
	case err = <-finished:
	case <-ctx.Done():
		err = ErrAppCancel
	}

	// todo: update status
	e.status = Finished

	return
}

func (e *Executor) logScaled(ctx context.Context, freq time.Duration) {
	ch := make(chan interface{})

	go func(channel chan interface{}) {
		for range time.Tick(freq) {
			channel <- struct{}{}
		}
	}(ch)

	if err := e.logScaledOnCue(ctx, ch); err != nil {
		log.Fatal("failed logScaledOnCue", "err", err)
	}
}

func timestampMs() int64 {
	return time.Now().UnixNano() / 1e6 // ms
}

func (e *Executor) logScaledOnCue(ctx context.Context, ch chan interface{}) error {
	var err error
	for {
		select {
		case <-ch:
			now := timestampMs()
			e.mu.Lock()
			units := e.units
			e.mu.Unlock()
			fmt.Printf(" data called ====")
			for _, u := range units {
				base := &metrics.BasedReqMetric{
					AppID: e.appID,
					Time:  now,
				}
				h := u.h.Snapshot()
				ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
				hv := &metrics.HistogramValues{
					Count:  h.Count(),
					Min:    h.Min(),
					Max:    h.Max(),
					Mean:   h.Mean(),
					Stddev: h.StdDev(),
					Median: ps[0],
					P75:    ps[1],
					P95:    ps[2],
					P99:    ps[3],
					P999:   ps[4],
				}
				fmt.Printf(" historgram Value %+v \n", *hv)
				switch u.Type {
				case metrics.Counter:
					cR := &metrics.CounterReq{
						Base:  base,
						Count: u.c.Count(),
					}
					fmt.Printf(" CounterReq Value %+v \n", cR)

				case metrics.Histogram:
					h := u.h.Snapshot()
					ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
					hv := metrics.HistogramValues{
						Count:  h.Count(),
						Min:    h.Min(),
						Max:    h.Max(),
						Mean:   h.Mean(),
						Stddev: h.StdDev(),
						Median: ps[0],
						P75:    ps[1],
						P95:    ps[2],
						P99:    ps[3],
						P999:   ps[4],
					}
					fmt.Printf(" historgram Value %+v \n", hv)
				case metrics.Gauge:
					gaugeS := &metrics.GaugeReq{
						Base:  base,
						Gauge: u.g.Value(),
					}
					fmt.Printf(" gaugeS Value %+v \n", gaugeS)

				}

				if err != nil {
					log.Fatal("metric log failed", "err", err)
				}
			}
		case <-ctx.Done():
			log.Print("logScaledOnCue canceled")
			return nil
		}
	}
}

func (e *Executor) Notify(title string, value int64) error {
	e.mu.Lock()
	defer e.mu.Unlock()
	u, ok := e.units[title]
	if !ok {
		log.Print("metric not found", "title", title)
		return ErrIDNotFound
	}

	if u.Type == metrics.Counter {
		u.c.Inc(value)
	}

	if u.Type == metrics.Histogram {
		u.h.Update(value)
	}

	if u.Type == metrics.Gauge {
		u.g.Update(value)
	}

	return nil
}
