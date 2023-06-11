package db

import (
	"github.com/cirnum/loadtester/server/db/providers"
	"github.com/cirnum/loadtester/server/db/providers/sql"
	log "github.com/sirupsen/logrus"
)

// Provider returns the current database provider
var Provider providers.Provider

func InitDB() error {
	var err error

	log.Info("Initializing DB")
	Provider, err = sql.NewProvider()
	if err != nil {
		log.Fatal("Failed to initialize SQL driver: ", err)
		return err
	}

	return nil
}
