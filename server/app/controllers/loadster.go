package controllers

import (
	"context"
	"fmt"
	"time"

	_ "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/app/utils"
	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	pkgUtils "github.com/cirnum/strain-hub/server/pkg/utils"

	"github.com/cirnum/strain-hub/server/db"
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
	loadsterRequest := &models.Loadster{}

	if err := c.BodyParser(&loadsterRequest); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	fmt.Printf("loadsterRequest %+v \n", loadsterRequest)
	if loadsterRequest.Finish == true {
		worker := &models.Worker{
			Status:    true,
			ServerId:  loadsterRequest.ServerId,
			ReqId:     loadsterRequest.ReqId,
			UpdatedAt: time.Now().Unix(),
		}
		db.Provider.UpdateWorkerStatusBySId(ctx, worker)
	}
	requestAnalysis, err := db.Provider.AddLoadByRequestId(ctx, *loadsterRequest)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, requestAnalysis, "Request analysis Saved.", fiber.StatusOK)
}
