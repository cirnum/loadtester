package main

import (
	"embed"
	"log"
	"os"
	"time"

	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/pkg/configs"
	"github.com/cirnum/strain-hub/server/pkg/middleware"
	"github.com/cirnum/strain-hub/server/pkg/routes"
	"github.com/cirnum/strain-hub/server/pkg/utils"
	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload" // load .env file automatically
)

var f embed.FS
var embedDirStatic embed.FS

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
	routes.ServerRoutes(app)

	// Custom config
	app.Static("/", "dist", fiber.Static{
		Compress:      true,
		ByteRange:     true,
		Browse:        true,
		Index:         "index.html",
		CacheDuration: 10 * time.Second,
		MaxAge:        3600,
	})

	app.Get("/*", func(c *fiber.Ctx) error {
		if err := c.SendFile("dist/index.html"); err != nil {
			return c.Next()
		}
		return nil
	})

	routes.NotFoundRoute(app)

	// Start server (with or without graceful shutdown).
	if os.Getenv("STAGE_STATUS") == "dev" {
		utils.StartServer(app)
	} else {
		utils.StartServerWithGracefulShutdown(app)
	}
}
