package utils

import "github.com/cirnum/loadtester/server/db/models"

func IsLoadTestingFinish(loadsterRequests *[]models.Loadster) (bool, string, string) {
	var reqId string
	var serverId string
	for _, req := range *loadsterRequests {
		reqId = req.ReqId
		serverId = req.ServerId
		if req.Finish {
			return true, reqId, serverId
		}
	}
	return false, reqId, serverId
}
