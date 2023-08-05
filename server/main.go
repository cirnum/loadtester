package main

import (
	"fmt"

	rice "github.com/GeertJohan/go.rice"
	log "github.com/sirupsen/logrus"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/pkg/configs"

	"github.com/cirnum/loadtester/server/pkg/routes"
	"github.com/cirnum/loadtester/server/pkg/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	_ "github.com/joho/godotenv/autoload" // load .env file automatically
)

func main() {
	store := configs.StoreInitialize()
	config := configs.FiberConfig()
	app := fiber.New(config)
	isWorker := utils.GetRunnerType(store)
	// initialize db provider
	if !isWorker {
		err := db.InitDB()
		if err != nil {
			log.Fatalln("Error while initializing db: ", err)
		}
		app.Get("/*", filesystem.New(filesystem.Config{
			Root: rice.MustFindBox("./dist").HTTPBox(),
		}))
	}

	routes.RouteAggregator(isWorker, app)
	fmt.Printf("%+v", configs.StoreProvider)
	// Start server (with or without graceful shutdown).
	if configs.StoreProvider.STAGE_STATUS == "dev" {
		utils.StartServer(app)
	} else {
		utils.StartServerWithGracefulShutdown(app)
	}
}
