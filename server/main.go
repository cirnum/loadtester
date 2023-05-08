package main

import (
	"log"
	"os"

	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/pkg/configs"
	"github.com/cirnum/strain-hub/server/pkg/middleware"
	"github.com/cirnum/strain-hub/server/pkg/routes"
	"github.com/cirnum/strain-hub/server/pkg/utils"
	"github.com/gofiber/fiber/v2"

	_ "github.com/joho/godotenv/autoload" // load .env file automatically
)

func main() {
	config := configs.FiberConfig()

	app := fiber.New(config)

	// initialize db provider
	err := db.InitDB()
	if err != nil {
		log.Fatalln("Error while initializing db: ", err)
	}

	// Middlewares.
	middleware.FiberMiddleware(app)

	// Routes.
	routes.PublicRoutes(app)
	routes.RequestRoutes(app)
	routes.NotFoundRoute(app)

	// Start server (with or without graceful shutdown).
	if os.Getenv("STAGE_STATUS") == "dev" {
		utils.StartServer(app)
	} else {
		utils.StartServerWithGracefulShutdown(app)
	}
}
