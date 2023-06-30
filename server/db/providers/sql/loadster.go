package sql

import (
	"context"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/google/uuid"
)

// AddRequest to update user information in database
func (p *provider) AddLoadByRequestId(ctx context.Context, request models.Loadster) (models.Loadster, error) {
	if request.ID == "" {
		request.ID = uuid.New().String()
	}

	request.CreatedAt = time.Now().UnixMilli()
	request.UpdatedAt = time.Now().UnixMilli()

	result := p.db.Create(&request)

	if result.Error != nil {
		return request, result.Error
	}

	return request, nil
}

// batchRequest to update user information in database
func (p *provider) AddBatchLoadByRequestId(ctx context.Context, requests []models.Loadster) error {
	loadReq := []models.Loadster{}
	for _, req := range requests {
		req.ID = uuid.New().String()
		req.CreatedAt = time.Now().UnixMilli()
		req.UpdatedAt = time.Now().UnixMilli()
		loadReq = append(loadReq, req)
	}

	result := p.db.Create(&loadReq)

	if result.Error != nil {
		return result.Error
	}

	return nil
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
