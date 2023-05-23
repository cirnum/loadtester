package utils

import (
	customModels "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/db/models"
)

func CalculateRPS(loads []models.Loadster, worker []models.Worker) customModels.CalculatedLoad {
	serverMap, isFinish := MapReqByServer(loads)
	calculatedInfo := CalculateRPSByTitle(serverMap)
	calculatedInfo.Finish = isFinish
	calculatedInfo.Workers = worker
	return calculatedInfo
}

func HttpReqByType(loads []models.Loadster, reqType string) ([]models.Loadster, models.Loadster) {
	var lastReqLoad models.Loadster
	filterLoad := []models.Loadster{}

	for _, load := range loads {
		if load.Title == reqType {
			filterLoad = append(filterLoad, load)
		}
		if load.Title == reqType && load.Finish {
			lastReqLoad = load
		}
	}
	if lastReqLoad.Count < 1 && len(filterLoad) > 0 {
		lastReqLoad = filterLoad[len(filterLoad)-1]
	}
	return filterLoad, lastReqLoad
}

func CalculateRPSByTitle(loadsByServer map[string][]models.Loadster) customModels.CalculatedLoad {
	var minLat int64 = 999999
	var maxLat int64 = 0

	calculatedLoads := customModels.CalculatedLoad{}
	calculatedLoads.ServerMap = map[string]customModels.WorkerData{}
	for key, load := range loadsByServer {
		var loadPayload customModels.WorkerData
		latency, lastLatency := HttpReqByType(load, ".latency")
		okHTTP, lastOkHttp := HttpReqByType(load, ".http_ok")
		failHTTP, lastFailHTTP := HttpReqByType(load, ".http_fail")
		otherFailHTTP, lastOtherFailHTTP := HttpReqByType(load, ".http_other_fail")
		totalTimeTaken := lastLatency.CreatedAt - lastLatency.StartTime

		if lastFailHTTP.Count > 0 {
			loadPayload.FailRPS = lastFailHTTP.Count / totalTimeTaken
			loadPayload.TotalFailRequest = lastFailHTTP.Count
			calculatedLoads.TotalFailRequest += lastFailHTTP.Count
			calculatedLoads.FailRPS += loadPayload.FailRPS
		}
		if lastOtherFailHTTP.Count > 0 {
			loadPayload.OtherFailRPS = lastOtherFailHTTP.Count / totalTimeTaken
			loadPayload.TotalOtherFailRequest = lastOtherFailHTTP.Count
			calculatedLoads.TotalOtherFailRequest += lastOtherFailHTTP.Count
			calculatedLoads.OtherFailRPS += loadPayload.OtherFailRPS

		}
		if lastOkHttp.Count > 0 {
			loadPayload.SuccessRPS = lastOkHttp.Count / totalTimeTaken
			loadPayload.TotalSuccessRequest = lastOkHttp.Count
			calculatedLoads.TotalSuccessRequest += lastOkHttp.Count
			calculatedLoads.SuccessRPS += loadPayload.SuccessRPS
		}
		if lastLatency.Count > 0 {
			loadPayload.TotalRPS = lastLatency.Count / totalTimeTaken
			loadPayload.TotalRequest = lastLatency.Count
			calculatedLoads.TotalRequest += lastLatency.Count
			calculatedLoads.TotalRPS += loadPayload.TotalRPS
		}
		loadPayload.ServerId = lastLatency.ServerId
		loadPayload.TotalFailRPS = loadPayload.OtherFailRPS + loadPayload.FailRPS

		loadPayload.MinLatency = lastLatency.Min
		loadPayload.MaxLatency = lastLatency.Max
		loadPayload.Latency = latency
		loadPayload.Success = okHTTP
		loadPayload.Fail = failHTTP
		loadPayload.OtherFail = otherFailHTTP
		loadPayload.TimeTaken = totalTimeTaken
		loadPayload.FailPercentage = calculatePercentage(loadPayload.TotalRequest, loadPayload.TotalSuccessRequest)
		calculatedLoads.ServerMap[key] = loadPayload
		calculatedLoads.TotalFailRPS += loadPayload.TotalFailRPS
		calculatedLoads.TimeTaken = totalTimeTaken

		if minLat > loadPayload.MinLatency {
			minLat = loadPayload.MinLatency
		}
		if maxLat < loadPayload.MaxLatency {
			maxLat = loadPayload.MaxLatency
		}
	}
	calculatedLoads.FailPercentage = calculatePercentage(calculatedLoads.TotalRequest, calculatedLoads.TotalSuccessRequest)
	calculatedLoads.MaxLatency = maxLat
	calculatedLoads.MinLatency = minLat
	return calculatedLoads
}

func calculatePercentage(total int64, amount int64) int {
	if total > 0 {
		return int((total - amount) / total * 100)
	}
	return 0
}

func calculateRpsForEachLoad(load models.Loadster) int64 {
	endTime := load.Created
	startTime := load.StartTime
	return (load.Count / (endTime - startTime))
}
func MapReqByServer(loads []models.Loadster) (map[string][]models.Loadster, bool) {
	var isFinish bool = false
	loadByServer := make(map[string][]models.Loadster)
	for _, load := range loads {
		serverId := load.ServerId
		load.RPS = calculateRpsForEachLoad(load)
		if serverId == "" {
			serverId = "MASTER"
			load.ServerId = serverId
		}
		if load.Finish {
			isFinish = load.Finish
		}
		if len(loadByServer[serverId]) > 0 {
			loadByServer[serverId] = append(loadByServer[serverId], load)
		} else {
			loadByServer[serverId] = []models.Loadster{load}
			loadByServer[serverId] = append(loadByServer[serverId], load)
		}
	}
	return loadByServer, isFinish
}