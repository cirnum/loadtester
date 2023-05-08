package utils

import (
	"fmt"
	"strconv"

	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/gofiber/fiber/v2"
)

func GetPagination(c *fiber.Ctx) models.Pagination {
	var limit int64 = 20
	var page int64 = 1
	var err error
	if c.Query("limit") != "" {
		limit, err = strconv.ParseInt(c.Query("limit"), 10, 64)
		fmt.Println("Error while prase,", err)
	}
	if c.Query("page") != "" {
		page, err = strconv.ParseInt(c.Query("page"), 10, 64)
		fmt.Println("Error while prase,", err)
	}
	offset := (page - 1) * limit
	return models.Pagination{
		Page:   page,
		Limit:  limit,
		Offset: offset,
	}

}
