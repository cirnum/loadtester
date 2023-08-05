package executor

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/configs"
	metrics "github.com/cirnum/loadtester/server/pkg/executor/metrics"
	"github.com/cirnum/loadtester/server/pkg/utils"
	gometrics "github.com/rcrowley/go-metrics"
	log "github.com/sirupsen/logrus"
)

const (
	Idle     status        = "idle"
	Running  status        = "running"
	Finished status        = "finished"
	poll     time.Duration = 3
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

func NewExecutor(reqId string, serverId string) *Executor {
	e := getExecutor()
	e.mu.Lock()
	defer e.mu.Unlock()
	e.units = make(map[string]unit)
	e.appID = reqId
	e.serverId = serverId
	e.status = Idle
	return e
}

func (e *Executor) Setup(groups []metrics.Group, reqId string) error {
	units := make(map[string]unit)
	for _, group := range groups {
		for _, graph := range group.Graphs {
			for _, m := range graph.Metrics {
				indetifier := e.appID + m.Title
				switch m.Type {
				case metrics.Counter:
					c := gometrics.NewCounter()
					if err := gometrics.Register(indetifier, c); err != nil {
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
				case metrics.Histogram:
					s := gometrics.NewExpDecaySample(1028, 0.015)
					h := gometrics.NewHistogram(s)
					if err := gometrics.Register(indetifier, h); err != nil {
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
				case metrics.Gauge:
					g := gometrics.NewGauge()
					if err := gometrics.Register(indetifier, g); err != nil {
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
	e.mu.Lock()
	defer e.mu.Unlock()
	for k, v := range units {
		e.units[k] = v
	}
	e.startTime = time.Now().UnixMilli()
	return nil
}

func (e *Executor) Run(ctx context.Context, conf models.Request) error {
	e.systemloadSetup(conf.ID)
	e.status = Running
	finished := make(chan error)
	go e.logScaled(ctx, poll*time.Second, finished)
	go e.systemloadRun(ctx)
	select {
	case err := <-finished:
		e.status = Finished
		return err
	case <-ctx.Done():
		e.status = Finished
		return ErrAppCancel
	}
}

func (e *Executor) logScaled(ctx context.Context, freq time.Duration, finished chan error) {
	ticker := time.NewTicker(freq)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			finish := false
			e.sendLoadData(finish)
		case <-ctx.Done():
			finish := true
			e.sendLoadData(finish)
			finished <- nil
			return
		}
	}
}

func timestampMs() int64 {
	return time.Now().UnixNano() / 1e6 // ms
}

func (e *Executor) sendLoadData(isFinish bool) {
	e.mu.Lock()
	units := e.units
	e.mu.Unlock()
	data, _ := e.GrabCounter(isFinish, units)
	ctx := context.Background()
	config := configs.ConfigProvider

	if config.IsSlave {
		body, _ := json.Marshal(data)
		url := config.MasterIp + "/api/v1/loadster"
		headers := map[string]string{
			"Content-Type": "application/json",
		}
		res, err := utils.Do(http.MethodPost, url, body, headers)
		if err != nil {
			log.Error("Failed to connect to master host", err.Error())
		}
		if res != nil {
			log.Warnf("For url: %s, statusCode: %d", url, res.StatusCode)
		}
	} else {
		db.Provider.AddBatchLoadByRequestId(ctx, data)
	}
}

func (e *Executor) GrabCounter(isFinish bool, units map[string]unit) ([]models.Loadster, error) {
	e.mu.Lock()
	defer e.mu.Unlock()
	now := time.Now().Unix()
	var data []models.Loadster
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
				Finish:    isFinish,
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
				Finish:    isFinish,
			}
			data = append(data, histo)
		case metrics.Gauge:
			counter := models.Loadster{
				Count:     u.g.Value(),
				Type:      string(u.Type),
				Title:     u.Title,
				ReqId:     e.appID,
				ServerId:  e.serverId,
				Created:   now,
				StartTime: e.startTime,
				Finish:    isFinish,
			}
			data = append(data, counter)
		}
	}
	return data, nil
}

func (e *Executor) Notify(title string, value int64) error {
	e.mu.Lock()
	defer e.mu.Unlock()
	u, ok := e.units[title]
	if !ok {
		return ErrIDNotFound
	}
	switch u.Type {
	case metrics.Counter:
		u.c.Inc(value)
	case metrics.Histogram:
		u.h.Update(value)
	case metrics.Gauge:
		u.g.Update(value)
	}
	return nil
}
