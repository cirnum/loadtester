package routes

import (
	"github.com/cirnum/loadtester/server/app/controllers"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func WorkerModeRoutes(a *fiber.App) {
	// Create routes group.
	route := a.Group("/worker")
	server := "/request"
	// user routes
	route.Post(server, controllers.RunRequest)
	route.Post("/connect", controllers.ConnectWithMaster)
	route.Get("/config", controllers.GetTempConfig)
	route.Get(server, controllers.IsWorkerRunning)
}
