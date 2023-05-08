package controllers

import (
	"context"
	"fmt"
	"time"

	_ "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/app/utils"
	httpRequest "github.com/cirnum/strain-hub/server/pkg/clients"

	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	"github.com/cirnum/strain-hub/server/pkg/executor"
	"github.com/gofiber/fiber/v2"
)

// To Get all the users
func GetAllRequest(c *fiber.Ctx) error {
	ctx := context.Background()
	pagination := utils.GetPagination(c)
	fmt.Printf("request pagination is : %+v \n", pagination)
	listUsers, err := db.Provider.RequestList(ctx, &pagination)

	if err != nil {
		return utils.ResponseError(c, err, constants.ErrorWhileRetriving, 0)
	}
	return utils.ResponseSuccess(c, listUsers, constants.UserRetriveSuccess, 0)

}
func NewRequest(c *fiber.Ctx) error {

	requestpayload := &models.Request{}
	// requestBody := &customModels.Request{}

	if err := c.BodyParser(requestpayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	// Start request with cancel context
	ctx := context.Background()

	request, err := db.Provider.AddRequest(ctx, *requestpayload)
	executor := executor.NewExecutor(request.ID)
	ctx, cancelCtx := context.WithCancel(ctx)
	go func() {
		<-time.After(time.Duration(requestpayload.Time) * time.Second)
		cancelCtx()
	}()

	go executor.Run(ctx, request)
	client, _ := httpRequest.Initializer(request.ID)
	go client.RunScen(ctx, request)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, request, "Request save successfully.", fiber.StatusOK)
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
	ctx := context.Background()
	id := c.Params("id")

	err := db.Provider.DeleteRequestById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, nil, "Request save successfully.", fiber.StatusOK)
}
