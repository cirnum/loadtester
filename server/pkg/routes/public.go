package routes

import (
	"github.com/cirnum/strain-hub/server/app/controllers"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func PublicRoutes(a *fiber.App) {
	// Create routes group.
	route := a.Group("/api/v1")

	// user routes
	route.Get("/user/ping", controllers.Ping)
	route.Get("/user/pong", controllers.Pong)

	route.Post("/user/signin", controllers.SingIn)
	route.Post("/user/signup", controllers.SingUp)

}
