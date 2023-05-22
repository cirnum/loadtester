package sql

import (
	"context"
	"errors"
	"time"

	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/google/uuid"
)

// AddRequest to update user information in database
func (p *provider) AddRequest(ctx context.Context, request models.Request) (models.Request, error) {
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

// ListRequest to get list of users from database
func (p *provider) RequestList(ctx context.Context, pagination *models.Pagination) (*models.RequestList, error) {
	var requests []models.Request
	userId := ctx.Value("userId")

	result := p.db.Where("user_id = ?", userId).Limit(int(pagination.Limit)).Offset(int(pagination.Offset)).Order("created_at DESC").Find(&requests)
	if result.Error != nil {
		return nil, result.Error
	}

	requestList := []models.Request{}
	for _, request := range requests {
		requestList = append(requestList, request)
	}

	var total int64
	totalRes := p.db.Model(&models.Request{}).Count(&total)
	if totalRes.Error != nil {
		return nil, totalRes.Error
	}

	paginationClone := pagination
	paginationClone.Total = total

	return &models.RequestList{
		Pagination: paginationClone,
		Data:       requestList,
	}, nil
}

// UpdateUser to update user information in database
func (p *provider) GetRequestById(ctx context.Context, id string) (models.Request, error) {
	var request models.Request

	if id == "" {
		return request, errors.New("Request id missing.")
	}

	result := p.db.Where("id = ?", id).First(&request)
	if result.Error != nil {
		return request, result.Error
	}

	return request, nil
}

// Delete Request by id to update user information in database
func (p *provider) DeleteRequestById(ctx context.Context, id string) error {
	userId := ctx.Value("userId")

	if id == "" {
		return errors.New("Request id missing.")
	}

	result := p.db.Where("user_id = ? ", userId).Delete(&models.Request{
		ID: id,
	})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
