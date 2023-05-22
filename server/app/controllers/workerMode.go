package controllers

import (
	"context"
	"log"
	"time"

	_ "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/app/utils"
	"github.com/cirnum/strain-hub/server/db/models"
	httpRequest "github.com/cirnum/strain-hub/server/pkg/clients"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	"github.com/cirnum/strain-hub/server/pkg/executor"

	"github.com/gofiber/fiber/v2"
)

// NewSessionRequest is ...
func RunRequest(c *fiber.Ctx) error {
	ctx := context.Background()
	request := &models.Request{}
	log.Println("Run request hit")

	if err := c.BodyParser(request); err != nil {
		log.Println("Run request Body", err)

		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}
	log.Printf("Run request Body %+v \n", request)

	executor := executor.NewExecutor(request.ID, request.ServerId)
	ctx, cancelCtx := context.WithCancel(ctx)

	go func() {
		<-time.After(time.Duration(request.Time) * time.Second)
		cancelCtx()
	}()

	go executor.Run(ctx, *request)

	client, _ := httpRequest.Initializer(request.ID)
	go client.RunScen(ctx, *request)

	return utils.ResponseSuccess(c, request, "Worker Started.", fiber.StatusOK)
}

func IsWorkerRunning(c *fiber.Ctx) error {
	return utils.ResponseSuccess(c, nil, "Service running.", fiber.StatusOK)
}
