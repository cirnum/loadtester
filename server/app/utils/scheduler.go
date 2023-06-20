package utils

import (
	"context"
	"time"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/jasonlvhit/gocron"
	log "github.com/sirupsen/logrus"
)

func JobScheduler(ec2s []models.EC2) {
	allSave := false
	fn1 := func() {
		ctx := context.Background()
		if len(ec2s) > 0 {
			foundEC2, err := GetRunningInstance(ec2s)
			if err != nil {
				log.Error("Error while fetcjing ec2 from aws")
			}

			if !allSave && len(foundEC2) > 0 {
				db.Provider.UpdateEc2(ctx, foundEC2)
				if len(foundEC2) == len(ec2s) {
					allSave = true
				}
			}
		}

	}
	gocron.Every(15).Seconds().Do(fn1)
	gocron.Start()

	time.Sleep(2 * time.Minute)
	gocron.Remove(fn1)
}
