package utils

import (
	"time"

	"github.com/cirnum/loadtester/server/db/models"
)

func GetWorkerLoa(request models.Request) *models.Worker {
	worker := &models.Worker{}
	worker.Clients = request.Clients
	worker.Created = time.Now().Unix()
	worker.ReqId = request.ID
	worker.Status = true
	return worker
}
