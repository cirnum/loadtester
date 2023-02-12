package helpers

import (
	"net/url"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ValidatePagination(query url.Values) (bool, options.FindOptions) {
	options := options.FindOptions{}
	options.SetSort(bson.D{{"_id", -1}})

	page, err := strconv.ParseInt(query.Get("page"), 10, 16)
	if err != nil {
		return false, options
	}
	limit, err := strconv.ParseInt(query.Get("limit"), 10, 16)
	if err != nil {
		return false, options
	}
	if page > 0 && limit > 0 {
		skip := (page - 1) * limit
		options.Skip = &skip
		options.Limit = &limit

		return true, options
	}

	return false, options

}
