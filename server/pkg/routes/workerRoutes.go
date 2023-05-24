package routes

import (
	"github.com/cirnum/loadtester/server/app/controllers"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func WorkerModeRoutes(a *fiber.App) {
	// Create routes group.
	server := "/request"
	route := a.Group("/worker")
	// user routes
	route.Post(server, controllers.RunRequest)
	route.Get(server, controllers.IsWorkerRunning)
}
