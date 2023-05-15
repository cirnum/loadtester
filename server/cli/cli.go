package main

import (
	"flag"
	"os"

	"github.com/cirnum/strain-hub/server/cli/app"
	"github.com/cirnum/strain-hub/server/cli/config"
	_ "github.com/joho/godotenv/autoload" // load .env file automatically
)

func main() {
	portPtr := flag.String("port", "5001", "Take the dafault port if port is empty (Required)")
	token := flag.String("token", "", "Please pass the token (Required)")
	masterIp := flag.String("masterIp", "", "Please pass the master node ip.")
	flag.Parse()

	if *token == "" || *masterIp == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}
	config := config.Initialize(*portPtr, *token, *masterIp)
	app.Initialize(config)
}
