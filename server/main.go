package main

import (
	"embed"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/pkg/configs"
	"github.com/clerkinc/clerk-sdk-go/clerk"

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
	InitializeAuthClient()
	if isWorker {
		routes.WorkerModeRoutes(app)
	} else {
		// Routes.
		routes.PublicRoutes(app)
		routes.RequestRoutes(app)
		routes.ServerRoutes(app)
		routes.JobsRoutes(app)

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
	portPtr := flag.String("PORT", "3005", "Take the dafault port if port is empty (Required)")
	token := flag.String("TOKEN", "", "Please pass the token (Required)")
	masterIp := flag.String("MASTER_IP", "", "Please pass the master node ip.")
	flag.Parse()

	localIp := utils.GetPublicIp()
	if *token == "" || *masterIp == "" {
		configs.ConfigProvider = configs.Initialize(os.Getenv("PORT"), "", "")
		configs.ConfigProvider.HostIp = localIp
		configs.ConfigProvider.IsSlave = false
		configs.ConfigProvider.IP = os.Getenv("SERVER_HOST")
		fmt.Printf("Master %+v \n", configs.ConfigProvider)
		return false
	}
	log.Println("Started node as worker.")
	configs.ConfigProvider = configs.Initialize(*portPtr, *token, *masterIp)
	configs.ConfigProvider.IsSlave = true
	configs.ConfigProvider.IP = "0.0.0.0"
	configs.ConfigProvider.HostIp = localIp
	fmt.Printf("Worker %+v \n", configs.ConfigProvider)
	return true
}

func InitializeAuthClient() {
	secretKey := os.Getenv("CLERK_AUTH")
	if secretKey != "" {
		var err error
		configs.ConfigProvider.AuthClient, err = clerk.NewClient(secretKey)
		if err != nil {
			log.Println("Failed to initilize auth client")
		}
	}
}
