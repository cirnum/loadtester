package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/manojown/api-testing-premium/app"
	log "github.com/sirupsen/logrus"
)

func main() {
	var filename string = "./logfile.log"
	// Create the log file if doesn't exist. And append to it if it already exists.
	f, err := os.OpenFile(filename, os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0644)
	if err != nil {
		// Cannot open log file. Logging to stderr
		fmt.Println(err)
	} else {
		log.SetFormatter(&log.JSONFormatter{})
		log.SetOutput(f)
		log.SetLevel(log.WarnLevel)

	}
	godotenv.Load()
	app.Initialize()
}
