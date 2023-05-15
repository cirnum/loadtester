package sql

import (
	"context"
	"errors"
	"time"

	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/google/uuid"
)

// AddServer to update user information in database
func (p *provider) AddServer(ctx context.Context, server models.Server) (models.Server, error) {
	if server.ID == "" {
		server.ID = uuid.New().String()
	}
	server.Token = uuid.New().String()
	server.CreatedAt = time.Now().Unix()
	server.UpdatedAt = time.Now().Unix()

	result := p.db.Create(&server)

	if result.Error != nil {
		return server, result.Error
	}

	return server, nil
}

// AddServer to update user information in database
func (p *provider) UpdateServer(ctx context.Context, server models.Server) (models.Server, error) {
	server.UpdatedAt = time.Now().Unix()
	result := p.db.Model(&server).Where("id = ?", server.ID).Update("UpdatedAt", server.UpdatedAt)
	if result.Error != nil {
		return server, result.Error
	}
	return server, nil
}

// ListServer to get list of users from database
func (p *provider) ListServer(ctx context.Context, pagination *models.Pagination) (*models.ServerList, error) {
	var servers []models.Server
	result := p.db.Limit(int(pagination.Limit)).Offset(int(pagination.Offset)).Order("created_at DESC").Find(&servers)
	if result.Error != nil {
		return nil, result.Error
	}

	serverList := []models.Server{}
	for _, request := range servers {
		serverList = append(serverList, request)
	}

	var total int64
	totalRes := p.db.Model(&models.Request{}).Count(&total)
	if totalRes.Error != nil {
		return nil, totalRes.Error
	}

	paginationClone := pagination
	paginationClone.Total = total

	return &models.ServerList{
		Pagination: paginationClone,
		Data:       serverList,
	}, nil
}

// GetServerById to update user information in database
func (p *provider) GetServerById(ctx context.Context, id string) (models.Server, error) {
	var server models.Server

	if id == "" {
		return server, errors.New("Request id missing.")
	}

	result := p.db.Where("id = ?", id).First(&server)
	if result.Error != nil {
		return server, result.Error
	}

	return server, nil
}

// DeleteServerById Request by id to update user information in database
func (p *provider) DeleteServerById(ctx context.Context, id string) error {

	if id == "" {
		return errors.New("Request id missing.")
	}

	result := p.db.Delete(&models.Server{
		ID: id,
	})
	if result.Error != nil {
		return result.Error
	}
	return nil
}