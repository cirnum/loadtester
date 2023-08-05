package utils

import (
	"strings"

	customModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/db/models"
)

func CalculateRPS(loads []models.Loadster, workers []models.Worker) customModels.CalculatedLoad {
	serverMap, isFinish := MapReqByServer(loads)
	calculatedInfo := CalculateRPSByTitle(serverMap, workers)
	calculatedInfo.Finish = isFinish
	return calculatedInfo
}

func CalculateRPSByTitle(loadsByServer map[string][]models.Loadster, workers []models.Worker) customModels.CalculatedLoad {
	var minLat int64 = 999999
	var maxLat int64 = 0

	calculatedLoads := customModels.CalculatedLoad{}
	calculatedLoads.ServerMap = make(map[string]customModels.WorkerData, len(loadsByServer))
	for key, load := range loadsByServer {
		loadPayload := customModels.WorkerData{}
		latency, lastLatency := HttpReqByType(load, ".latency")
		okHTTP, lastOkHttp := HttpReqByType(load, ".http_ok")
		failHTTP, lastFailHTTP := HttpReqByType(load, ".http_fail")
		otherFailHTTP, lastOtherFailHTTP := HttpReqByType(load, ".http_other_fail")
		loadAvg1, lastLoadAvg := HttpReqByType(load, "LA1")
		cpu, lastCpuUsage := HttpReqByType(load, "CPU")
		ram, lastRamUsage := HttpReqByType(load, "RAM")
		outgress, lastOutgress := calcDataTransfer(load, "transmit")
		ingress, lastIngress := calcDataTransfer(load, "receive")
		totalTimeTaken := int64((lastLatency.CreatedAt - lastLatency.StartTime) / 1000)

		if lastFailHTTP.Count > 0 {
			loadPayload.FailRPS = lastFailHTTP.Count / totalTimeTaken
			loadPayload.TotalFailRequest = lastFailHTTP.Count
			calculatedLoads.TotalFailRequest += lastFailHTTP.Count
			calculatedLoads.FailRPS += loadPayload.FailRPS
		}
		if lastOtherFailHTTP.Count > 0 && totalTimeTaken > 0 {
			loadPayload.OtherFailRPS = lastOtherFailHTTP.Count / totalTimeTaken
			loadPayload.TotalOtherFailRequest = lastOtherFailHTTP.Count
			calculatedLoads.TotalOtherFailRequest += lastOtherFailHTTP.Count
			calculatedLoads.OtherFailRPS += loadPayload.OtherFailRPS

		}
		if lastOkHttp.Count > 0 && totalTimeTaken > 0 {
			loadPayload.SuccessRPS = lastOkHttp.Count / totalTimeTaken
			loadPayload.TotalSuccessRequest = lastOkHttp.Count
			calculatedLoads.TotalSuccessRequest += lastOkHttp.Count
			calculatedLoads.SuccessRPS += loadPayload.SuccessRPS
		}
		if lastLatency.Count > 0 && totalTimeTaken > 0 {
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
		// Server details
		loadPayload.LoadAvg = loadAvg1
		loadPayload.CpuUsage = cpu
		loadPayload.RamUsage = ram
		loadPayload.Ingress = ingress
		loadPayload.Outgress = outgress
		loadPayload.LastLoadAvg = lastLoadAvg.Count
		loadPayload.LastCpuUsage = lastCpuUsage.Count
		loadPayload.LastRamUsage = lastRamUsage.Count
		loadPayload.LastIngress = lastIngress.Count
		loadPayload.LastOutgress = lastOutgress.Count

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
	calculatedLoads.Workers = workers
	calculatedLoads.FailPercentage = calculatePercentage(calculatedLoads.TotalRequest, calculatedLoads.TotalSuccessRequest)
	calculatedLoads.MaxLatency = maxLat
	calculatedLoads.MinLatency = minLat
	return calculatedLoads
}

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
	endTime := load.Created
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
