package configs

import (
	"fmt"
	"strconv"
	"time"

	"github.com/cirnum/loadtester/server/version"
	"github.com/gofiber/fiber/v2"
)

// FiberConfig func for configuration Fiber app.
// See: https://docs.gofiber.io/api/fiber#config
func FiberConfig() fiber.Config {
	// Define server settings.
	readTimeoutSecondsCount, _ := strconv.Atoi(StoreProvider.SERVER_READ_TIMEOUT)
	version := fmt.Sprintf("LoadTester: %d.%d.%d\n", version.Major, version.Minor, version.Patch)

	// Return Fiber configuration.
	return fiber.Config{
		ReadTimeout:           time.Second * time.Duration(readTimeoutSecondsCount),
		AppName:               version,
		DisableStartupMessage: true,
	}
}
