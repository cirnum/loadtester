package utils

import (
	"flag"
	"fmt"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/configs"
	log "github.com/sirupsen/logrus"
)

func GetWorkerLoa(request models.Request) *models.Worker {
	worker := &models.Worker{}
	worker.Clients = request.Clients
	worker.Created = time.Now().Unix()
	worker.ReqId = request.ID
	worker.Status = true
	return worker
}

func GetRunnerType() bool {
	portPtr := flag.String("PORT", "3005", "Take the dafault port if port is empty")
	token := flag.String("TOKEN", "", "Please pass the token (Required)")
	masterIp := flag.String("MASTER_IP", "", "Please pass the master node ip. (Required)")
	worker := flag.Bool("WORKER", false, "")

	flag.Parse()
	localIp := GetPublicIp()

	if *worker == true || *token != "" || *masterIp != "" {
		configs.ConfigProvider = configs.Initialize(*portPtr, *token, *masterIp)
		configs.ConfigProvider.IsSlave = true
		configs.ConfigProvider.IP = "0.0.0.0"
		configs.ConfigProvider.HostIp = localIp + ":" + *portPtr
		configs.ConfigProvider.MasterIp = *masterIp
		log.Info(string("\033[34m"), "Worker service initiated.")
		return true
	}

	if configs.StoreProvider.PORT != "" {
		*portPtr = configs.StoreProvider.PORT
	}

	fmt.Printf("Master data %+v \n", configs.ConfigProvider)
	configs.ConfigProvider = configs.Initialize(*portPtr, "", "")
	configs.ConfigProvider.HostIp = localIp
	configs.ConfigProvider.IsSlave = false
	configs.ConfigProvider.IP = configs.StoreProvider.SERVER_HOST
	configs.ConfigProvider.HostUrl = fmt.Sprintf("%s://%s:%s", Http, configs.ConfigProvider.IP, *portPtr)
	log.Info(string("\033[34m"), "Master service initiated.")
	return false
}
