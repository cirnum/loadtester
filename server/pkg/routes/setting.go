package routes

import (
	"github.com/cirnum/loadtester/server/app/controllers"
	"github.com/cirnum/loadtester/server/pkg/middleware"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func SettingRoute(a *fiber.App) {
	// Create routes group.
	route := a.Group("/api/v1/setting")
	// user routes
	route.Get("/", middleware.JWTProtected, controllers.GetTempConfig)
	route.Post("/", middleware.JWTProtected, controllers.UpdateTempConfig)

	// route.Post("/loadster", controllers.AddLoadRequest)

}
