package controllers

import (
	"context"
	"log"
	"time"

	_ "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/app/utils"
	httpRequest "github.com/cirnum/strain-hub/server/pkg/clients"
	commonUtils "github.com/cirnum/strain-hub/server/pkg/utils"

	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	"github.com/cirnum/strain-hub/server/pkg/executor"
	"github.com/gofiber/fiber/v2"
)

// To Get all the users
func GetAllRequest(c *fiber.Ctx) error {
	ctx := context.WithValue(context.Background(), "userId", c.Locals("userId").(string))
	pagination := utils.GetPagination(c)
	listUsers, err := db.Provider.RequestList(ctx, &pagination)

	if err != nil {
		return utils.ResponseError(c, err, constants.ErrorWhileRetriving, 0)
	}
	return utils.ResponseSuccess(c, listUsers, constants.UserRetriveSuccess, 0)

}
func NewRequest(c *fiber.Ctx) error {

	ctx := context.Background()
	requestpayload := &models.Request{}
	// worker := &models.Worker{}

	if err := c.BodyParser(requestpayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}
	requestpayload.UserID = c.Locals("userId").(string)
	request, err := db.Provider.AddRequest(ctx, *requestpayload)
	executor := executor.NewExecutor(request.ID, "")
	ctx, cancelCtx := context.WithCancel(ctx)
	go func() {
		<-time.After(time.Duration(requestpayload.Time) * time.Second)
		cancelCtx()
	}()

	err = commonUtils.RunWorker(request)

	if err != nil {
		log.Println("Error while sending request to Worker", err)
	}
	go executor.Run(ctx, request)
	client, _ := httpRequest.Initializer(request.ID)
	go client.RunScen(ctx, request)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, request, "Request sent for stress testing.", fiber.StatusOK)
}

func GetRequest(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	request, err := db.Provider.GetRequestById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, request, "Request save successfully.", fiber.StatusOK)
}

func DeleteRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	ctx := context.WithValue(context.Background(), "userId", c.Locals("userId").(string))

	err := db.Provider.DeleteRequestById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, nil, "Request save successfully.", fiber.StatusOK)
}
