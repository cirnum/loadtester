package utils

import (
	"strconv"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/gofiber/fiber/v2"
)

func GetPagination(c *fiber.Ctx) models.Pagination {
	var limit int64 = 20
	var page int64 = 1
	if c.Query("limit") != "" {
		limit, _ = strconv.ParseInt(c.Query("limit"), 10, 64)
	}
	if c.Query("page") != "" {
		page, _ = strconv.ParseInt(c.Query("page"), 10, 64)
	}
	offset := (page - 1) * limit
	return models.Pagination{
		Page:   page,
		Limit:  limit,
		Offset: offset,
	}

}
