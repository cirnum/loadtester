package executor

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/configs"
	metrics "github.com/cirnum/strain-hub/server/pkg/executor/metrics"
	"github.com/cirnum/strain-hub/server/pkg/utils"
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
	ErrAppCancel     = errors.New("application is cancel")
	ErrAppPanic      = errors.New("application is panic")
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
	mu        sync.Mutex
	id        string
	appID     string
	serverId  string
	startTime int64
	endTime   int64
	status
	units map[string]unit //title - gometrics
}

// singleton instance of executor
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

func NewExecutor(reqId string, serverId string) (e *Executor) {
	e = getExecutor()
	e.units = make(map[string]unit)
	e.appID = reqId
	e.serverId = serverId
	e.status = Idle
	return
}

func (e *Executor) Setup(groups []metrics.Group, reqId string) error {
	units := make(map[string]unit)
	for _, group := range groups {
		for _, graph := range group.Graphs {
			for _, m := range graph.Metrics {
				if m.Type == metrics.Counter {
					c := gometrics.NewCounter()
					if err := gometrics.Register(e.appID+m.Title, c); err != nil {
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
					if err := gometrics.Register(e.appID, h); err != nil {
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
					if err := gometrics.Register(e.appID, g); err != nil {
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
	// aggregate units
	for k, v := range units {
		e.units[k] = v
	}
	e.startTime = time.Now().Unix()
	return nil
}

func (e *Executor) Run(ctx context.Context, conf models.Request) (err error) {
	e.status = Running
	finished := make(chan error)
	// when the runScen finished, we should stop the logScaled and systemloadRun
	// also; however, not necessary since the executor will be shutdown anyway
	go e.logScaled(ctx, 3*time.Second)
	select {
	case err = <-finished:
	case <-ctx.Done():
		err = ErrAppCancel
	}
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

func (e *Executor) GrabCounter(ctx context.Context, units map[string]unit) ([]models.Loadster, error) {
	var data []models.Loadster
	e.mu.Lock()
	now := time.Now().Unix()
	for _, u := range units {
		switch u.Type {
		case metrics.Counter:
			counter := models.Loadster{
				Count:     u.c.Count(),
				Type:      string(u.Type),
				Title:     u.Title,
				ReqId:     e.appID,
				ServerId:  e.serverId,
				Created:   now,
				StartTime: e.startTime,
			}
			data = append(data, counter)
		case metrics.Histogram:
			h := u.h.Snapshot()
			ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			histo := models.Loadster{
				Count:     h.Count(),
				Min:       h.Min(),
				Max:       h.Max(),
				Mean:      h.Mean(),
				Stddev:    h.StdDev(),
				Median:    ps[0],
				P75:       ps[1],
				P95:       ps[2],
				P99:       ps[3],
				P999:      ps[4],
				Type:      string(u.Type),
				Title:     u.Title,
				ReqId:     e.appID,
				ServerId:  e.serverId,
				Created:   now,
				StartTime: e.startTime,
			}
			data = append(data, histo)
		}
	}
	e.mu.Unlock()
	return data, nil
}
func (e *Executor) logScaledOnCue(ctx context.Context, ch chan interface{}) error {
	for {
		select {
		case <-ch:
			e.mu.Lock()
			units := e.units
			e.mu.Unlock()
			data, _ := e.GrabCounter(ctx, units)
			ctx := context.Background()
			for _, value := range data {
				if value.Count > 0 {
					config := configs.ConfigProvider
					value.Token = config.Token

					if config.IsSlave == true {
						body, _ := json.Marshal(value)
						url := config.MasterIp + "/api/v1/loadster"
						headers := map[string]string{
							"Content-Type": "application/json",
						}
						utils.Do("POST", url, body, headers)
					} else {
						db.Provider.AddLoadByRequestId(ctx, value)
					}
				}
			}
		case <-ctx.Done():
			config := configs.ConfigProvider
			data, _ := e.GrabCounter(ctx, e.units)
			for _, value := range data {
				value.Finish = true
				if value.Count > 0 {
					value.Token = config.Token
					if config.IsSlave == true {
						headers := map[string]string{
							"Content-Type": "application/json",
						}
						body, _ := json.Marshal(value)
						url := config.MasterIp + "/api/v1/loadster"
						utils.Do("POST", url, body, headers)
					} else {
						db.Provider.AddLoadByRequestId(ctx, value)
					}
				}
			}
			return nil
		}
	}
}

func (e *Executor) Notify(title string, value int64) error {
	e.mu.Lock()
	defer e.mu.Unlock()
	u, ok := e.units[title]
	if !ok {
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
