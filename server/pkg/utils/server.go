package utils

import (
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/gofiber/fiber/v2"
)

// Check server Status
func ServerStatus(servers *models.ServerList) *models.ServerList {
	data := []models.Server{}
	for _, server := range servers.Data {
		url := server.IP + "/worker/request"
		res, err := Do("GET", url, nil, nil)
		if err != nil {
			server.UpdatedAt = time.Now().Unix()
			server.Active = false
		}
		if err == nil && res.StatusCode == fiber.StatusOK {
			server.UpdatedAt = time.Now().Unix()
			server.Active = true
		}
		data = append(data, server)
	}
	servers.Data = data
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
			log.Printf("Oops... Server is not shutting down! Reason: %v", err)
		}

		close(idleConnsClosed)
	}()

	// Build Fiber connection URL.
	fiberConnURL, _ := ConnectionURLBuilder("fiber")

	// Run server.
	if err := a.Listen(fiberConnURL); err != nil {
		log.Printf("Oops... Server is not running! Reason: %v", err)
	}

	<-idleConnsClosed
}

// StartServer func for starting a simple server.
func StartServer(a *fiber.App) {
	// Build Fiber connection URL.
	fiberConnURL, _ := ConnectionURLBuilder("fiber")
	// Run server.
	if err := a.Listen(fiberConnURL); err != nil {
		log.Printf("Oops... Server is not running! Reason: %v", err)
	}
}
