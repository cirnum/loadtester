package controllers

import (
	"github.com/cirnum/loadtester/server/app/utils"
	"github.com/cirnum/loadtester/server/pkg/configs"
	"github.com/cirnum/loadtester/server/pkg/constants"

	"github.com/gofiber/fiber/v2"
)

var count int = 0

func UpdateTempConfig(c *fiber.Ctx) error {
	config := &configs.Config{}
	if err := c.BodyParser(config); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	if config.HostUrl != "" {
		configs.ConfigProvider.HostUrl = config.HostUrl
	}
	return utils.ResponseSuccess(c, configs.ConfigProvider, "Config Updated Successfully.", fiber.StatusOK)
}

func GetData(c *fiber.Ctx) error {
	return utils.ResponseSuccess(c, count, "Config recieved Succesfully.", fiber.StatusOK)
}

func GetTempConfig(c *fiber.Ctx) error {
	defer func() {
		count = count + 1
	}()
	return utils.ResponseSuccess(c, configs.ConfigProvider, "Config recieved Succesfully.", fiber.StatusOK)
}
