package sql

import (
	"context"
	"time"

	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/google/uuid"
)

// AddRequest to update user information in database
func (p *provider) AddLoadByRequestId(ctx context.Context, request models.Loadster) (models.Loadster, error) {
	if request.ID == "" {
		request.ID = uuid.New().String()
	}

	request.CreatedAt = time.Now().Unix()
	request.UpdatedAt = time.Now().Unix()

	result := p.db.Create(&request)

	if result.Error != nil {
		return request, result.Error
	}

	return request, nil
}

// get Load by request Id to update user information in database
func (p *provider) GetLoadByRequestId(ctx context.Context, pagination models.Pagination, requestId string) ([]models.Loadster, error) {
	var loadster []models.Loadster
	result := p.db.Where("req_id = ?", requestId).Offset(int(pagination.Offset)).Order("created ASC").Find(&loadster)
	if result.Error != nil {
		return nil, result.Error
	}
	return loadster, nil
}
