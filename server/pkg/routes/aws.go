package routes

import (
	"github.com/cirnum/loadtester/server/app/controllers"
	"github.com/cirnum/loadtester/server/pkg/middleware"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func AWSRoutes(a *fiber.App) {
	// Create routes group.
	route := a.Group("/api/v1/aws")
	// user routes
	route.Get("/create/pem", controllers.CreatePemKey)
	route.Get("/get/pem", controllers.GetPemKey)
	route.Post("/ec2", middleware.JWTProtected, controllers.CreateEC2)
	route.Get("/ec2", middleware.JWTProtected, controllers.GetRunningEC2)
	route.Delete("/ec2", middleware.JWTProtected, controllers.TerminateEC2)

	// route.Post("/loadster", controllers.AddLoadRequest)

}
