package controllers

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"

	"time"

	reqModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/app/utils"
	"github.com/cirnum/loadtester/server/db/models"
	httpRequest "github.com/cirnum/loadtester/server/pkg/clients"
	"github.com/cirnum/loadtester/server/pkg/configs"
	"github.com/cirnum/loadtester/server/pkg/constants"
	"github.com/cirnum/loadtester/server/pkg/executor"

	"github.com/gofiber/fiber/v2"
)

// NewSessionRequest is ...
func RunRequest(c *fiber.Ctx) error {
	ctx := context.Background()
	request := &models.Request{}

	if err := c.BodyParser(request); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}
	log.Info("Run request for: ", request.ServerId)

	executor := executor.NewExecutor(request.ID, request.ServerId)
	ctx, cancelCtx := context.WithCancel(ctx)

	go func() {
		<-time.After(time.Duration(request.Time) * time.Second)
		cancelCtx()
	}()

	go executor.Run(ctx, *request)

	client, _ := httpRequest.Initializer(*request)
	go client.RunScen(ctx, *request)

	return utils.ResponseSuccess(c, request, "Worker Started.", fiber.StatusOK)
}

func ConnectWithMaster(c *fiber.Ctx) error {
	masterDetails := &reqModels.MasterDetails{}
	if err := c.BodyParser(masterDetails); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	configs.ConfigProvider.MasterIp = masterDetails.Address
	fmt.Println("Updated config", configs.ConfigProvider)
	return utils.ResponseSuccess(c, configs.ConfigProvider, "Master Ip Attached.", fiber.StatusOK)
}

func IsWorkerRunning(c *fiber.Ctx) error {
	return utils.ResponseSuccess(c, nil, "Service running.", fiber.StatusOK)
}
