package controllers

import (
	"context"

	_ "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/app/utils"
	"github.com/google/uuid"

	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	"github.com/gofiber/fiber/v2"
)

// To Get all the Server
func GetAllServer(c *fiber.Ctx) error {
	ctx := context.Background()
	pagination := utils.GetPagination(c)
	listServer, err := db.Provider.ListServer(ctx, &pagination)

	if err != nil {
		return utils.ResponseError(c, err, "Failed to add the server.", 0)
	}
	return utils.ResponseSuccess(c, listServer, "Server added successfully.", 0)

}

// To Update server
func UpdateServer(c *fiber.Ctx) error {
	ctx := context.Background()
	serverPayload := &models.Server{}

	if err := c.BodyParser(serverPayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
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
	serverPayload.ID = uuid.New().String()
	jwtToken, err := utils.GenerateTokenKey(*serverPayload)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}

	serverPayload.Token = jwtToken
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
	ctx := context.Background()
	id := c.Params("id")

	err := db.Provider.DeleteServerById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, nil, "Fetched Server lists.", fiber.StatusOK)
}
