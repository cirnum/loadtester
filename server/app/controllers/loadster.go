package controllers

import (
	"context"

	_ "github.com/cirnum/strain-hub/server/app/models"
	"github.com/cirnum/strain-hub/server/app/utils"
	"github.com/cirnum/strain-hub/server/db/models"

	"github.com/cirnum/strain-hub/server/db"
	"github.com/gofiber/fiber/v2"
)

func GetLoadByRequestId(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	request, err := db.Provider.GetLoadByRequestId(ctx, models.Pagination{
		Limit:  10,
		Offset: 0,
	}, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, request, "Request Load Recieve.", fiber.StatusOK)
}
