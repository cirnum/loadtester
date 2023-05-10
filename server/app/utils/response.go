package utils

import (
	"github.com/gofiber/fiber/v2"
)

func ResponseError(c *fiber.Ctx, err error, message string, statusCode int) error {
	var status int
	if statusCode != 0 {
		status = statusCode
	} else {
		status = fiber.StatusNotFound
	}
	return c.Status(status).JSON(fiber.Map{
		"error":   true,
		"message": message,
		"data":    nil,
	})
}

func ResponseSuccess(c *fiber.Ctx, data interface{}, message string, statusCode int) error {
	var status int
	if statusCode != 0 {
		status = statusCode
	} else {
		status = fiber.StatusOK
	}
	return c.Status(status).JSON(fiber.Map{
		"error":   false,
		"message": message,
		"data":    data,
	})
}
