package controllers

import (
	"context"

	helperModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/app/utils"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/constants"
	"github.com/gofiber/fiber/v2"
)

const (
	ReqSendToTestMSG = "Request sent for stress testing."
	ReqSavedMSG      = "Request save successfully."
	ID               = "id"
)

// To Get all the users
func GetAllRequest(c *fiber.Ctx) error {
	ctx := context.WithValue(context.Background(), UserId, c.Locals(UserId).(string))
	pagination := utils.GetPagination(c)
	listUsers, err := db.Provider.RequestList(ctx, &pagination)

	if err != nil {
		return utils.ResponseError(c, err, constants.ErrorWhileRetriving, 0)
	}
	return utils.ResponseSuccess(c, listUsers, constants.UserRetriveSuccess, 0)

}
func NewRequest(c *fiber.Ctx) error {
	var responsePayload helperModels.ResponsePayload
	var err error
	ctx := context.Background()
	requestpayload := &models.Request{}

	if err := c.BodyParser(requestpayload); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	requestpayload.UserID = c.Locals(UserId).(string)

	// To check whether requested endpoint is reachable or not.
	responsePayload.Response, err = utils.TestRequest(requestpayload)
	if err != nil {
		return utils.ResponseError(c, err, constants.InvalidRequest, fiber.StatusInternalServerError)
	}

	request, err := db.Provider.AddRequest(ctx, *requestpayload)
	err = utils.RunExecutor(ctx, request)
	responsePayload.Request = request

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, responsePayload, ReqSendToTestMSG, fiber.StatusOK)
}

func GetRequest(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params(ID)

	request, err := db.Provider.GetRequestById(ctx, id)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, request, ReqSavedMSG, fiber.StatusOK)
}

func DeleteRequest(c *fiber.Ctx) error {
	id := c.Params(ID)
	ctx := context.WithValue(context.Background(), UserId, c.Locals(UserId).(string))

	err := db.Provider.DeleteRequestById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, nil, ReqSavedMSG, fiber.StatusOK)
}
