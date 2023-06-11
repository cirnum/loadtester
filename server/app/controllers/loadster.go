package controllers

import (
	"context"
	"time"

	_ "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/app/utils"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/constants"
	pkgUtils "github.com/cirnum/loadtester/server/pkg/utils"

	"github.com/cirnum/loadtester/server/db"
	"github.com/gofiber/fiber/v2"
)

func GetLoadByRequestId(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	loads, err := db.Provider.GetLoadByRequestId(ctx, models.Pagination{
		Limit:  10,
		Offset: 0,
	}, id)

	workerData, err := db.Provider.GetWorkerByReqId(ctx, id)

	load := pkgUtils.CalculateRPS(loads, workerData)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, load, "Request Load Recieve.", fiber.StatusOK)
}

func GetAllLoad(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	loads, err := db.Provider.GetLoadByRequestId(ctx, models.Pagination{
		Limit:  10,
		Offset: 0,
	}, id)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, loads, "Request Load Recieve.", fiber.StatusOK)
}

func AddLoadRequest(c *fiber.Ctx) error {
	ctx := context.Background()
	loadsterRequests := &[]models.Loadster{}

	if err := c.BodyParser(&loadsterRequests); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	isFinish, reqId, serverID := utils.IsLoadTestingFinish(loadsterRequests)

	if isFinish == true {
		worker := &models.Worker{
			Status:    true,
			ServerId:  serverID,
			ReqId:     reqId,
			UpdatedAt: time.Now().Unix(),
		}
		db.Provider.UpdateWorkerStatusBySId(ctx, worker)
	}
	err := db.Provider.AddBatchLoadByRequestId(ctx, *loadsterRequests)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, nil, "Request analysis Saved.", fiber.StatusOK)
}
