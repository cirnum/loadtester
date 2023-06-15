package utils

import (
	"encoding/json"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"time"

	reqModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/configs"

	"github.com/gofiber/fiber/v2"
	log "github.com/sirupsen/logrus"
)

const (
	WorkerConnectionFailed string = "connection failed to master due to status code: "
	SomethingWentWrong     string = "Something went wrong."
)
const (
	Protocol   string = "http://"
	WorkerPath string = "/worker/connect"
	WorkerReq  string = "/worker/request"
)

func SendMasterIp(publicIp string) bool {
	var url string
	hostDetails := &reqModels.MasterDetails{
		Address: Protocol + configs.ConfigProvider.HostIp,
	}
	postData, _ := json.Marshal(hostDetails)
	if strings.Contains(publicIp, "http") || strings.Contains(publicIp, "https") {
		url = publicIp + WorkerPath
	} else {
		url = Protocol + publicIp + WorkerPath
	}

	headers := map[string]string{
		"Content-Type": "application/json",
	}

	res, err := Do(http.MethodPost, url, postData, headers)
	if err != nil {
		log.Error(SomethingWentWrong, err)
		return false
	}
	if err == nil && res != nil && res.StatusCode == fiber.StatusOK {
		return true
	}

	log.Info(WorkerConnectionFailed, res.StatusCode)
	return false
}

// Sync server With Master
func SyncWithMaster(servers *models.EC2List) ([]models.EC2, []models.EC2) {
	var wg sync.WaitGroup
	var success []models.EC2
	var failed []models.EC2
	wg.Add(len(servers.Data))

	for _, server := range servers.Data {
		go func(server models.EC2) {
			if server.PublicIp != "" {
				isSuccess := SendMasterIp(server.PublicIp)
				if isSuccess {
					success = append(success, server)
				} else {
					failed = append(failed, server)
				}
			}
			wg.Done()
		}(server)
	}
	wg.Wait()
	return success, failed
}

// Check server Status
func ServerStatus(servers *models.ServerList) *models.ServerList {
	wg := new(sync.WaitGroup)

	wg.Add(len(servers.Data))
	data := []models.Server{}
	for _, server := range servers.Data {
		func() {
			url := server.IP + WorkerReq
			res, err := Do(http.MethodGet, url, nil, nil)
			if err != nil {
				server.UpdatedAt = time.Now().Unix()
				server.Active = false
			}
			if err == nil && res.StatusCode == fiber.StatusOK {
				server.UpdatedAt = time.Now().Unix()
				server.Active = true
			}
			data = append(data, server)
			wg.Done()
		}()
	}
	wg.Wait()
	servers.Data = data
	return servers
}

// Create Server Mapping to save ec2 to server table
func SaveEc2ToServer(ec2s []models.EC2) []models.Server {
	var servers []models.Server
	for _, ec2 := range ec2s {
		server := models.Server{}
		server.Active = true
		server.UpdatedAt = time.Now().Unix()
		server.IP = Protocol + ec2.PublicIp
		server.Alias = ec2.InstanceId
		server.Description = ec2.PublicDns
		servers = append(servers, server)
	}
	return servers
}

// StartServerWithGracefulShutdown function for starting server with a graceful shutdown.
func StartServerWithGracefulShutdown(a *fiber.App) {
	// Create channel for idle connections.
	idleConnsClosed := make(chan struct{})

	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt) // Catch OS signals.
		<-sigint

		// Received an interrupt signal, shutdown.
		if err := a.Shutdown(); err != nil {
			// Error from closing listeners, or context timeout:
			log.Errorf("Oops... Server is not shutting down! Reason: %v", err)
		}

		close(idleConnsClosed)
	}()

	// Build Fiber connection URL.
	fiberConnURL, _ := ConnectionURLBuilder("fiber")

	// Run server.
	if err := a.Listen(fiberConnURL); err != nil {
		log.Errorf("Oops... Server is not running! Reason: %v", err)
	}

	<-idleConnsClosed
}

// StartServer func for starting a simple server.
func StartServer(a *fiber.App) {
	// Build Fiber connection URL.
	fiberConnURL, _ := ConnectionURLBuilder("fiber")
	// Run server.
	if err := a.Listen(fiberConnURL); err != nil {
		log.Errorf("Oops... Server is not running! Reason: %v", err)
	}
}
