package routes

import (
	"github.com/cirnum/strain-hub/server/app/controllers"
	"github.com/cirnum/strain-hub/server/pkg/middleware"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func JobsRoutes(a *fiber.App) {
	// Create routes group.
	route := a.Group("/api/v1")
	// user routes
	route.Get("/worker/:id", middleware.JWTProtected, controllers.GetWorkerByReqId)

}
