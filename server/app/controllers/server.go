package controllers

import (
	"context"

	_ "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/app/utils"
	pkgUtils "github.com/cirnum/loadtester/server/pkg/utils"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/constants"
	"github.com/gofiber/fiber/v2"
)

// To Get all the Server
func GetAllServer(c *fiber.Ctx) error {
	ctx := context.WithValue(context.Background(), "userId", c.Locals("userId").(string))

	pagination := utils.GetPagination(c)

	listServer, err := db.Provider.ListServer(ctx, &pagination)
	serverList := pkgUtils.ServerStatus(listServer)
	if err != nil {
		return utils.ResponseError(c, err, "Failed to add the server.", 0)
	}
	return utils.ResponseSuccess(c, serverList, "Server added successfully.", 0)

}

// To Update server
func UpdateServer(c *fiber.Ctx) error {
	ctx := context.Background()
	serverPayload := &models.Server{}

	if err := c.BodyParser(serverPayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	if serverPayload.ID == "" {
		return utils.ResponseError(c, nil, "Server id missing to update.", 0)
	}
	updatedServer, err := db.Provider.UpdateServer(ctx, *serverPayload)

	if err != nil {
		return utils.ResponseError(c, err, "Failed to update the server.", 0)
	}
	return utils.ResponseSuccess(c, updatedServer, "Server Updated successfully.", 0)

}

func AddServer(c *fiber.Ctx) error {

	ctx := context.Background()
	serverPayload := &models.Server{}

	if err := c.BodyParser(serverPayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}
	serverPayload.UserID = c.Locals("userId").(string)
	server, err := db.Provider.AddServer(ctx, *serverPayload)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, server, "Server added successfully.", fiber.StatusOK)
}

func GetServerById(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	server, err := db.Provider.GetRequestById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, server, "Server retrieved successfully.", fiber.StatusOK)
}

func DeleteServerById(c *fiber.Ctx) error {
	id := c.Params("id")

	ctx := context.WithValue(context.Background(), "userId", c.Locals("userId").(string))

	err := db.Provider.DeleteServerById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, nil, "Server deleted successfully.", fiber.StatusOK)
}
