package routes

import (
	"github.com/cirnum/loadtester/server/app/controllers"
	"github.com/cirnum/loadtester/server/pkg/middleware"
	"github.com/gofiber/fiber/v2"
)

// PrivateRoutes func for describe group of private routes.
func ServerRoutes(a *fiber.App) {
	// Create routes group.
	server := "/server"
	route := a.Group("/api/v1")
	// user routes
	route.Post(server, middleware.JWTProtected, controllers.AddServer)
	route.Get(server, middleware.JWTProtected, controllers.GetAllServer)
	route.Get(server+"/:id", middleware.JWTProtected, controllers.GetServerById)
	route.Delete(server+"/:id", middleware.JWTProtected, controllers.DeleteServerById)
	route.Put(server, middleware.JWTProtected, controllers.UpdateServer)
	route.Get("syncmaster", middleware.JWTProtected, controllers.SyncServerWithMaster)
}
