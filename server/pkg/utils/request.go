package utils

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/db/models"
)

var statusOK int = 200

func GetWorkerLoad(request models.Request) models.Worker {
	worker := models.Worker{}
	worker.Clients = request.Clients
	worker.Created = time.Now().UnixMilli()
	worker.ReqId = request.ID
	worker.Status = false
	return worker
}

func RunWorker(request models.Request) error {
	var wg sync.WaitGroup
	ctx := context.Background()

	listServer, err := db.Provider.ListServerByUserId(ctx, request.UserID)
	if err != nil {
		return err
	}
	wg.Add(len(listServer))

	for _, element := range listServer {
		go func(element models.Server) {
			if element.Enabled {
				url := element.IP
				worker := GetWorkerLoad(request)
				request.ServerId = element.ID
				body, _ := json.Marshal(request)

				if url != "" {
					worker.ServerId = element.ID
					url = strings.TrimSpace(strings.TrimSpace(url) + "/worker/request")
					headers := map[string]string{
						"Content-Type": "application/json",
					}
					res, err := Do(http.MethodPost, url, body, headers)

					if err != nil {
						worker.Status = true
						// worker.ServerId = element.ID
						worker.Error = err.Error()
						db.Provider.AddWorker(ctx, worker)
					} else if res.StatusCode == statusOK {
						worker.Status = false
						// worker.ServerId = element.ID
						db.Provider.AddWorker(ctx, worker)
					}
				}
			}
			wg.Done()
		}(element)
	}
	wg.Wait()
	return nil
}
