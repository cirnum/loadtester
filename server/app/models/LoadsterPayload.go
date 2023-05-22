package models

import "github.com/cirnum/strain-hub/server/db/models"

type CalculatedLoad struct {
	Workers               []models.Worker       `json:"workers"`
	TotalRPS              int64                 `json:"totalRPS"`
	TotalRequest          int64                 `json:"totalRequest"`
	SuccessRPS            int64                 `json:"successRPS"`
	TotalSuccessRequest   int64                 `json:"totalSuccessRequest"`
	TotalFailRPS          int64                 `json:"totalFailRPS"`
	FailRPS               int64                 `json:"failRPS"`
	TotalFailRequest      int64                 `json:"totalFailRequest"`
	OtherFailRPS          int64                 `json:"totherFailRPS"`
	TotalOtherFailRequest int64                 `json:"totalOtherFailRequest"`
	Finish                bool                  `json:"finish"`
	ServerMap             map[string]WorkerData `json:"serverMap"`
	TimeTaken             int64                 `json:"timeTaken"`
	FailPercentage        int                   `json:"failPercentage"`
	MinLatency            int64                 `json:"minLatency"`
	MaxLatency            int64                 `json:"maxLatency"`
}

type WorkerData struct {
	ServerId              string            `json:"serverId"`
	TotalRequest          int64             `json:"totalRequest"`
	TotalSuccessRequest   int64             `json:"totalSuccessRequest"`
	TotalOtherFailRequest int64             `json:"totalOtherFailRequest"`
	TotalFailRequest      int64             `json:"totalFailRequest"`
	TotalRPS              int64             `json:"totalRPS"`
	SuccessRPS            int64             `json:"successRPS"`
	TotalFailRPS          int64             `json:"totalFailRPS"`
	FailRPS               int64             `json:"failRPS"`
	OtherFailRPS          int64             `json:"otherFailRPS"`
	TimeTaken             int64             `json:"timeTaken"`
	Latency               []models.Loadster `json:"latency"`
	Success               []models.Loadster `json:"success"`
	Fail                  []models.Loadster `json:"fail"`
	OtherFail             []models.Loadster `json:"otherFail"`
	FailPercentage        int               `json:"failPercentage"`
	MinLatency            int64             `json:"minLatency"`
	MaxLatency            int64             `json:"maxLatency"`
}
