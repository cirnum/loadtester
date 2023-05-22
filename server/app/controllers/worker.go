package controllers

import (
	"context"

	_ "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/app/utils"
	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	"github.com/gofiber/fiber/v2"
)

// To Get all the Server
func GetAllWorker(c *fiber.Ctx) error {
	ctx := context.WithValue(context.Background(), "userId", c.Locals("userId").(string))

	pagination := utils.GetPagination(c)
	listWorker, err := db.Provider.ListWorker(ctx, &pagination)

	if err != nil {
		return utils.ResponseError(c, err, "Failed to add the server.", 0)
	}
	return utils.ResponseSuccess(c, listWorker, "Worker list send successfully.", 0)

}

// To Update server
func UpdateWorker(c *fiber.Ctx) error {
	ctx := context.Background()
	workerPayload := &models.Worker{}

	if err := c.BodyParser(workerPayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	if workerPayload.ID == "" {
		return utils.ResponseError(c, nil, "Worker id missing to update.", 0)
	}
	updatedServer, err := db.Provider.UpdateWorker(ctx, *workerPayload)

	if err != nil {
		return utils.ResponseError(c, err, "Failed to update the server.", 0)
	}
	return utils.ResponseSuccess(c, updatedServer, "Worker Updated successfully.", 0)

}

func AddWorker(c *fiber.Ctx) error {
	ctx := context.Background()
	workerPayload := &models.Worker{}

	if err := c.BodyParser(workerPayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}
	workerPayload.UserID = c.Locals("userId").(string)
	worker, err := db.Provider.AddWorker(ctx, *workerPayload)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, worker, "Worker added successfully.", fiber.StatusOK)
}

func GetWorkerById(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	worker, err := db.Provider.GetWorkerById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, worker, "Worker sent successfully.", fiber.StatusOK)
}

func GetWorkerByReqId(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	worker, err := db.Provider.GetWorkerByReqId(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, worker, "Worker details sent successfully.", fiber.StatusOK)
}
