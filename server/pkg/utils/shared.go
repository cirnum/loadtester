package utils

import (
	"flag"
	"fmt"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/configs"
	"github.com/cirnum/loadtester/server/version"
)

func GetWorkerLoa(request models.Request) *models.Worker {
	worker := &models.Worker{}
	worker.Clients = request.Clients
	worker.Created = time.Now().UnixMilli()
	worker.ReqId = request.ID
	worker.Status = true
	return worker
}

func PrintWelcome(service string, host string, port string) {
	version := fmt.Sprintf("%d.%d.%d", version.Major, version.Minor, version.Patch)
	serviceName := fmt.Sprintf("%s", service)
	fmt.Printf("\n\n\n")
	fmt.Println(string("\033[34m"), "              App Name:   LoadTester")
	fmt.Println(string("\033[34m"), "              Version:   ", version)
	fmt.Println(string("\033[34m"), "              Node:      ", serviceName)
	fmt.Println(string("\033[34m"), "              PORT:      ", port)
	fmt.Println(string("\033[34m"), "              Host:      ", host)
	fmt.Printf("\n\n\n")
}

func GetRunnerType(store configs.Store) bool {
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
		PrintWelcome("Worker", configs.ConfigProvider.HostIp, *portPtr)
		return true
	}

	if configs.StoreProvider.PORT != "" {
		*portPtr = configs.StoreProvider.PORT
	}

	// Initilize Store provider for config
	configs.ConfigProvider = configs.Initialize(*portPtr, "", "")
	if store.HostUrl == "" {
		configs.ConfigProvider.HostUrl = formedUrl(*portPtr, localIp)
	} else {
		configs.ConfigProvider.HostUrl = store.HostUrl
	}

	// AWS integration check
	available, errMsg := store.IsAwsAvailable()
	configs.ConfigProvider.HostIp = localIp
	configs.ConfigProvider.IsSlave = false
	configs.ConfigProvider.IP = configs.StoreProvider.SERVER_HOST
	configs.ConfigProvider.AwsErrorMessage = errMsg
	configs.ConfigProvider.IsAwsAvailable = available
	PrintWelcome("Master", configs.ConfigProvider.HostIp, *portPtr)
	return false
}

func formedUrl(port string, host string) string {
	if port == "80" {
		return fmt.Sprintf("%s://%s", Http, host)
	} else if port == "443" {
		return fmt.Sprintf("%s://%s", Https, host)
	}
	return fmt.Sprintf("%s://%s:%s", Http, host, port)
}
