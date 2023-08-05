package executor

import (
	"context"
	"time"

	metrics "github.com/cirnum/loadtester/server/pkg/executor/metrics"
	"github.com/mackerelio/go-osstat/loadavg"
	"github.com/mackerelio/go-osstat/network"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
	log "github.com/sirupsen/logrus"
)

const (
	slLA1    = "LA1"
	cpuUser  = "CPU"
	ramUsing = "RAM"
)

// systemload report the current host system load like cpu, ram, and network
// status

// systemloadSetup setup the metrics for systemload
func (e *Executor) systemloadSetup(reqId string) (err error) {
	group := metrics.Group{
		Name: "System Load",
		Graphs: []metrics.Graph{
			{
				Title: "Load average",
				Unit:  "*100",
				Metrics: []metrics.Metric{
					{
						Title: slLA1,
						Type:  metrics.Gauge,
					},
				},
			},
			{
				Title: "CPU",
				Unit:  "%",
				Metrics: []metrics.Metric{
					{
						Title: cpuUser,
						Type:  metrics.Gauge,
					},
				},
			},
			{
				Title: "RAM",
				Unit:  "%",
				Metrics: []metrics.Metric{
					{
						Title: ramUsing,
						Type:  metrics.Gauge,
					},
				},
			},
		},
	}

	// generate network metrics
	nss, err := network.Get()
	if err != nil {
		return
	}
	txMetrics := make([]metrics.Metric, 0, len(nss))
	rxMetrics := make([]metrics.Metric, 0, len(nss))
	for _, ns := range nss {
		// txMetrics = append(txMetrics, metrics.Metric{
		txMetrics = append(txMetrics, metrics.Metric{
			Title: ns.Name + " transmit",
			Type:  metrics.Gauge,
		})
		rxMetrics = append(rxMetrics, metrics.Metric{
			Title: ns.Name + " receive",
			Type:  metrics.Gauge,
		})
	}
	group.Graphs = append(group.Graphs, metrics.Graph{
		Title:   "Network transmit",
		Unit:    "KiB/s",
		Metrics: txMetrics,
	})
	group.Graphs = append(group.Graphs, metrics.Graph{
		Title:   "Network receive",
		Unit:    "KiB/s",
		Metrics: rxMetrics,
	})

	groups := []metrics.Group{
		group,
	}
	err = Setup(groups, reqId)
	return
}

type rtxBytes struct {
	rxBytes, txBytes uint64
}

// systemloadRun start collect the metrics
func (e *Executor) systemloadRun(ctx context.Context) (err error) {
	ch := make(chan interface{})

	go func(channel chan interface{}) {
		for range time.Tick(poll * time.Second) {
			channel <- struct{}{}
		}
	}(ch)

	nssPre := make(map[string]rtxBytes)
	nssPreTime := time.Now()
	var cpuPre []cpu.TimesStat

	for {
		select {
		case <-ctx.Done():
			log.Info("systemloadRun canceled")
			return nil

		case <-ch:
			// load average
			if la, err := loadavg.Get(); err == nil {
				la1 := int64(la.Loadavg1 * 100)
				Notify(slLA1, la1)
			}

			// network status
			if nss, err := network.Get(); err == nil {
				now := time.Now()
				for _, ns := range nss {
					prv, ok := nssPre[ns.Name]
					if ok {
						diffTime := now.Sub(nssPreTime).Seconds()

						tx := float64(ns.TxBytes-prv.txBytes) / diffTime // Bps
						rx := float64(ns.RxBytes-prv.rxBytes) / diffTime // Bps
						if int64(tx/1000) > 0 {
							Notify(ns.Name+" transmit", int64(tx/1000)) // KBps
							Notify(ns.Name+" receive", int64(rx/1000))  // KBps
						}
					}
					// update prv values
					nssPre[ns.Name] = rtxBytes{
						rxBytes: ns.RxBytes,
						txBytes: ns.TxBytes,
					}
				}
				nssPreTime = now
			}

			if memStats, err := mem.VirtualMemory(); err == nil {
				memUsage := memStats.UsedPercent
				Notify(ramUsing, int64(memUsage))
			}

			if cpuNow, err := cpu.Times(false); err == nil {
				userPercentage := calculateCpuUsage(cpuPre, cpuNow)
				Notify(cpuUser, int64(userPercentage))
				cpuPre = cpuNow
			}
		}
	}
}

func calculateCpuUsage(cpuStats1 []cpu.TimesStat, cpuStats2 []cpu.TimesStat) float64 {
	if len(cpuStats1) > 0 && len(cpuStats2) > 0 {
		totalUsage1, userUsage1 := totalUsage(cpuStats1)
		totalUsage2, userUsage2 := totalUsage(cpuStats2)
		totalDelta := totalUsage2 - totalUsage1
		userDelta := userUsage2 - userUsage1
		userPercentage := 100 * (userDelta / totalDelta)
		return userPercentage
	}
	return 0
}

func totalUsage(cpuStats []cpu.TimesStat) (float64, float64) {
	userUsage1 := cpuStats[0].User
	systemUsage1 := cpuStats[0].System
	idleUsage1 := cpuStats[0].Idle
	return (userUsage1 + systemUsage1 + idleUsage1), userUsage1
}
