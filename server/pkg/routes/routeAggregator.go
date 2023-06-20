package routes

import (
	"time"

	"github.com/cirnum/loadtester/server/pkg/middleware"
	"github.com/gofiber/fiber/v2"
)

func RouteAggregator(isWorker bool, app *fiber.App) {
	// Middlewares.
	middleware.FiberMiddleware(app)

	if isWorker {
		WorkerModeRoutes(app)
	} else {
		PublicRoutes(app)
		RequestRoutes(app)
		ServerRoutes(app)
		JobsRoutes(app)
		AWSRoutes(app)
		SettingRoute(app)

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
	}

	NotFoundRoute(app)
}
