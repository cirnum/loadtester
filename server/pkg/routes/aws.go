package routes

import (
	"github.com/cirnum/loadtester/server/app/controllers"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func AWSRoutes(a *fiber.App) {
	// Create routes group.
	route := a.Group("/api/v1")
	// user routes
	route.Get("/aws/create/pem", controllers.CreatePemKey)
	route.Get("/aws/get/pem", controllers.GetPemKey)
	route.Post("/aws/create/ec2", controllers.CreateEC2)
	route.Get("/aws/get/ec2", controllers.GetRunningEC2)
	route.Post("/aws/delete/ec2", controllers.TerminateEC2)

	// route.Post("/loadster", controllers.AddLoadRequest)

}
