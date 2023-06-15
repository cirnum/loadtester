package main

import (
	"embed"
	"flag"
	"fmt"

	"os"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/pkg/configs"

	"github.com/cirnum/loadtester/server/pkg/middleware"
	"github.com/cirnum/loadtester/server/pkg/routes"
	"github.com/cirnum/loadtester/server/pkg/utils"
	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload" // load .env file automatically
)

var f embed.FS
var embedDirStatic embed.FS

func main() {
	config := configs.FiberConfig()

	app := fiber.New(config)

	isWorker := isWorkerMode()
	// initialize db provider
	if !isWorker {
		err := db.InitDB()
		if err != nil {
			log.Fatalln("Error while initializing db: ", err)
		}
	}

	// Middlewares.
	middleware.FiberMiddleware(app)

	if isWorker {
		routes.WorkerModeRoutes(app)
	} else {
		// Routes.
		routes.PublicRoutes(app)
		routes.RequestRoutes(app)
		routes.ServerRoutes(app)
		routes.JobsRoutes(app)
		routes.AWSRoutes(app)
		routes.SettingRoute(app)

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

	routes.NotFoundRoute(app)

	// Start server (with or without graceful shutdown).
	if os.Getenv("STAGE_STATUS") == "dev" {
		utils.StartServer(app)
	} else {
		utils.StartServerWithGracefulShutdown(app)
	}
}

func isWorkerMode() bool {
	portPtr := flag.String("PORT", "3005", "Take the dafault port if port is empty")
	token := flag.String("TOKEN", "", "Please pass the token (Required)")
	masterIp := flag.String("MASTER_IP", "", "Please pass the master node ip. (Required)")
	worker := flag.Bool("WORKER", false, "")

	flag.Parse()
	localIp := utils.GetPublicIp()
	fmt.Println("master", *portPtr, *worker)

	if *worker == true || *token != "" || *masterIp != "" {
		fmt.Println("portPtr", *portPtr, *worker)
		configs.ConfigProvider = configs.Initialize(*portPtr, *token, *masterIp)
		configs.ConfigProvider.IsSlave = true
		configs.ConfigProvider.IP = "0.0.0.0"
		configs.ConfigProvider.HostIp = localIp + ":" + *portPtr
		configs.ConfigProvider.MasterIp = *masterIp
		log.Infof("Worker Config: %+v \n", configs.ConfigProvider)
		// log.Info(string("\033[34m"), "Worker service initiated.")
		return true
	}

	if os.Getenv("PORT") != "" {
		*portPtr = os.Getenv("PORT")
	}

	configs.ConfigProvider = configs.Initialize(*portPtr, "", "")
	configs.ConfigProvider.HostIp = localIp
	configs.ConfigProvider.IsSlave = false
	configs.ConfigProvider.IP = os.Getenv("SERVER_HOST")
	configs.ConfigProvider.HostUrl = fmt.Sprintf("http://%s:%s", configs.ConfigProvider.IP, *portPtr)
	// log.Infof("Master Config:  %+v \n", configs.ConfigProvider)
	log.Info(string("\033[34m"), "Master service initiated.")
	return false
}
