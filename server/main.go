package main

import (
	log "github.com/sirupsen/logrus"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/pkg/configs"

	"github.com/cirnum/loadtester/server/pkg/routes"
	"github.com/cirnum/loadtester/server/pkg/utils"
	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload" // load .env file automatically
)

func main() {
	config := configs.FiberConfig()
	store := configs.StoreInitialize()
	app := fiber.New(config)
	isWorker := utils.GetRunnerType(store)
	// initialize db provider
	if !isWorker {
		err := db.InitDB()
		if err != nil {
			log.Fatalln("Error while initializing db: ", err)
		}
	}

	routes.RouteAggregator(isWorker, app)

	// Start server (with or without graceful shutdown).
	if configs.StoreProvider.STAGE_STATUS == "dev" {
		utils.StartServer(app)
	} else {
		utils.StartServerWithGracefulShutdown(app)
	}
}
