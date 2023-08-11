package utils

import (
	"strings"

	customModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/db/models"
)

func CalculateRPS(loads []models.Loadster, workers []models.Worker) customModels.CalculatedLoad {
	serverMap, isFinish := MapReqByServer(loads)
	return CalculateRPSByTitle(serverMap, workers, isFinish)
}

func CalculateRPSByTitle(loadsByServer map[string][]models.Loadster, workers []models.Worker, isFinish bool) customModels.CalculatedLoad {
	calculatedLoads := customModels.CalculatedLoad{
		ServerMap: make(map[string]customModels.WorkerData, len(loadsByServer)),
		Finish:    isFinish,
	}

	for key, load := range loadsByServer {
		loadPayload := calculateLoadPayload(load)
		loadPayload.ServerId = load[0].ServerId
		calculatedLoads.ServerMap[key] = loadPayload
		calculatedLoads.TotalRequest += loadPayload.TotalRequest
		calculatedLoads.TotalSuccessRequest += loadPayload.TotalSuccessRequest
		calculatedLoads.TotalFailRequest += loadPayload.TotalFailRequest
		calculatedLoads.TotalOtherFailRequest += loadPayload.TotalOtherFailRequest
		calculatedLoads.FailRPS += loadPayload.FailRPS
		calculatedLoads.OtherFailRPS += loadPayload.OtherFailRPS
		calculatedLoads.SuccessRPS += loadPayload.SuccessRPS
		calculatedLoads.TotalRPS += loadPayload.TotalRPS
		calculatedLoads.TimeTaken = loadPayload.TimeTaken

		updateMinMaxLatency(&calculatedLoads, loadPayload)
	}

	calculatedLoads.Workers = workers
	calculatedLoads.FailPercentage = calculatePercentage(calculatedLoads.TotalRequest, calculatedLoads.TotalSuccessRequest)
	return calculatedLoads
}

func calculateLoadPayload(load []models.Loadster) customModels.WorkerData {
	loadPayload := customModels.WorkerData{}
	latency, lastLatency := HttpReqByType(load, ".latency")
	okHTTP, lastOkHttp := HttpReqByType(load, ".http_ok")
	failHTTP, lastFailHTTP := HttpReqByType(load, ".http_fail")
	otherFailHTTP, lastOtherFailHTTP := HttpReqByType(load, ".http_other_fail")

	loadPayload.FailRPS = calculateRPSFromCountAndTime(lastFailHTTP.Count, lastLatency)
	loadPayload.TotalFailRequest = lastFailHTTP.Count
	loadPayload.OtherFailRPS = calculateRPSFromCountAndTime(lastOtherFailHTTP.Count, lastLatency)
	loadPayload.TotalOtherFailRequest = lastOtherFailHTTP.Count
	loadPayload.SuccessRPS = calculateRPSFromCountAndTime(lastOkHttp.Count, lastLatency)
	loadPayload.TotalSuccessRequest = lastOkHttp.Count
	loadPayload.TotalRPS = calculateRPSFromCountAndTime(lastLatency.Count, lastLatency)
	loadPayload.TotalRequest = lastLatency.Count
	loadPayload.ServerId = lastLatency.ServerId
	loadPayload.TotalFailRPS = loadPayload.FailRPS + loadPayload.OtherFailRPS
	loadPayload.MinLatency = lastLatency.Min
	loadPayload.MaxLatency = lastLatency.Max
	loadPayload.Latency = latency
	loadPayload.Success = okHTTP

	// ... (other payload calculations)

	loadPayload.Fail = failHTTP
	loadPayload.OtherFail = otherFailHTTP
	loadPayload.TimeTaken = calculateTimeTaken(lastLatency)
	loadPayload.FailPercentage = calculatePercentage(loadPayload.TotalRequest, loadPayload.TotalSuccessRequest)
	return loadPayload
}

func calculateRPSFromCountAndTime(count int64, lastLatency models.Loadster) int64 {
	totalTimeTaken := calculateTimeTaken(lastLatency)
	if count > 0 && totalTimeTaken > 0 {
		return count / totalTimeTaken
	}
	return 0
}

func calculateTimeTaken(lastLatency models.Loadster) int64 {
	return (lastLatency.CreatedAt - lastLatency.StartTime) / 1000
}

func updateMinMaxLatency(calculatedLoads *customModels.CalculatedLoad, loadPayload customModels.WorkerData) {
	if loadPayload.MinLatency < calculatedLoads.MinLatency {
		calculatedLoads.MinLatency = loadPayload.MinLatency
	}
	if loadPayload.MaxLatency > calculatedLoads.MaxLatency {
		calculatedLoads.MaxLatency = loadPayload.MaxLatency
	}
}

// ... (HttpReqByType and other functions remain unchanged)

func HttpReqByType(loads []models.Loadster, reqType string) ([]models.Loadster, models.Loadster) {
	var lastReqLoad models.Loadster
	filterLoad := []models.Loadster{}

	for _, load := range loads {
		if strings.Contains(load.Title, reqType) {
			filterLoad = append(filterLoad, load)
		}
		if strings.Contains(load.Title, reqType) && load.Finish {
			lastReqLoad = load
		}
	}
	if lastReqLoad.Count < 1 && len(filterLoad) > 0 {
		lastReqLoad = filterLoad[len(filterLoad)-1]
	}
	return filterLoad, lastReqLoad
}

func calcDataTransfer(load []models.Loadster, nsType string) ([]models.Loadster, models.Loadster) {
	val := []models.Loadster{}
	var lastLoad models.Loadster
	data, _ := HttpReqByType(load, nsType)
	for _, value := range data {
		if value.Count > 0 {
			val = append(val, value)
		}
	}
	if len(val) > 0 {
		lastLoad = val[len(val)-1]
	}
	return val, lastLoad
}

func calculatePercentage(total int64, amount int64) int {
	if total > 0 {
		return int((total - amount) / total * 100)
	}
	return 0
}

func calculateRpsForEachLoad(load models.Loadster) int64 {
	endTime := load.CreatedAt
	startTime := load.StartTime
	if load.Count > 0 && ((endTime-startTime)/1000) > 0 {
		return (load.Count / ((endTime - startTime) / 1000))
	}
	return 0
}

func MapReqByServer(loads []models.Loadster) (map[string][]models.Loadster, bool) {
	var isFinish bool
	loadByServer := make(map[string][]models.Loadster)
	for _, load := range loads {
		serverId := load.ServerId
		load.RPS = calculateRpsForEachLoad(load)
		if serverId == "" {
			serverId = "MASTER"
			load.ServerId = serverId
		}
		if load.Finish {
			isFinish = true
		}
		if _, ok := loadByServer[serverId]; ok {
			loadByServer[serverId] = append(loadByServer[serverId], load)
		} else {
			loadByServer[serverId] = []models.Loadster{load}
			loadByServer[serverId] = append(loadByServer[serverId], load)
		}
	}
	return loadByServer, isFinish
}
