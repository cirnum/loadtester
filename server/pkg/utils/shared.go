package utils

import (
	"flag"
	"fmt"
	"os"
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

func PrintWelcome(localIp string, service string, host string, port string) {
	version := fmt.Sprintf("%d.%d.%d", version.Major, version.Minor, version.Patch)
	serviceName := fmt.Sprintf("%s", service)
	hostUrl := configs.ConfigProvider.HostUrl
	fmt.Printf("\n\n\n")
	fmt.Println(string("\033[34m"), "              App Name:   LoadTester")
	fmt.Println(string("\033[34m"), "              Version:   ", version)
	fmt.Println(string("\033[34m"), "              Node:      ", serviceName)
	fmt.Println(string("\033[34m"), "              PORT:      ", port)
	if hostUrl != "" {
		fmt.Println(string("\033[34m"), "              URL:       ", hostUrl)
	} else {
		fmt.Println(string("\033[34m"), "              URL:       ", formedUrl(port, localIp))
	}
	fmt.Printf("\n\n\n")
}

func isRunningInContainer() bool {
	if _, err := os.Stat("/.dockerenv"); err != nil {
		return false
	}
	return true
}

func GetRunnerType(store configs.Store) bool {
	portPtr := flag.String("PORT", "3005", "Take the dafault port if port is empty")
	token := flag.String("TOKEN", "", "Please pass the token (Required)")
	hostUrl := flag.String("HOST_URL", "", "Please pass the Host Url")
	masterIp := flag.String("MASTER_IP", "", "Please pass the master node ip. (Required)")
	worker := flag.Bool("WORKER", false, "")
	flag.Parse()

	localIp, err := GetIP()

	if err != nil {
		fmt.Println("Error while getting local ip", err)
	}

	if *worker == true || *token != "" || *masterIp != "" {
		configs.ConfigProvider = configs.Initialize(*portPtr, *token, *masterIp)
		configs.ConfigProvider.IsSlave = true
		configs.ConfigProvider.HostIp = localIp
		configs.ConfigProvider.HostUrl = formedUrl(*portPtr, localIp)
		configs.ConfigProvider.MasterIp = *masterIp
		PrintWelcome(localIp, "Worker", configs.ConfigProvider.HostIp, *portPtr)
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

	if *hostUrl != "" {
		configs.ConfigProvider.HostUrl = *hostUrl
	}

	// AWS integration check
	available, errMsg := store.IsAwsAvailable()
	configs.ConfigProvider.HostIp = localIp
	configs.ConfigProvider.IsSlave = false
	configs.ConfigProvider.IP = configs.StoreProvider.SERVER_HOST
	configs.ConfigProvider.AwsErrorMessage = errMsg
	configs.ConfigProvider.IsAwsAvailable = available
	PrintWelcome(localIp, "Master", configs.ConfigProvider.HostIp, *portPtr)
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
