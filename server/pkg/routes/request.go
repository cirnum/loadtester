package routes

import (
	"github.com/cirnum/strain-hub/server/app/controllers"
	"github.com/cirnum/strain-hub/server/pkg/middleware"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func RequestRoutes(a *fiber.App) {
	// Create routes group.
	route := a.Group("/api/v1")
	// user routes
	route.Post("/request", middleware.JWTProtected(), controllers.NewRequest)
	route.Get("/request", middleware.JWTProtected(), controllers.GetAllRequest)
	route.Get("/request/:id", middleware.JWTProtected(), controllers.GetRequest)
	route.Delete("/request/:id", middleware.JWTProtected(), controllers.DeleteRequest)
	route.Get("/loadster/:id", middleware.JWTProtected(), controllers.GetLoadByRequestId)
}
