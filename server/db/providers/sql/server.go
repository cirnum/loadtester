package sql

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/google/uuid"
)

const (
	UserId       = "user_id"
	UserToken    = "userId"
	RandLength   = 3
	ReqIdMissing = "Request id missing."
)

func UniqueToken(size int) string {
	n := size
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	return fmt.Sprintf("%X", b)

}

// AddServer to update user information in database
func (p *provider) AddServer(ctx context.Context, server models.Server) (models.Server, error) {
	if server.ID == "" {
		server.ID = uuid.New().String()
	}
	server.Token = UniqueToken(RandLength)
	server.CreatedAt = time.Now().UnixMilli()
	server.UpdatedAt = time.Now().UnixMilli()

	result := p.db.Create(&server)

	if result.Error != nil {
		return server, result.Error
	}

	return server, nil
}

// AddServer to update user information in database
func (p *provider) UpdateServer(ctx context.Context, server models.Server) (models.Server, error) {
	server.UpdatedAt = time.Now().UnixMilli()

	result := p.db.Save(&server)
	if result.Error != nil {
		return server, result.Error
	}
	return server, nil
}

// AddServer to update user information in database
func (p *provider) UpdateServerByIp(ctx context.Context, server models.Server) (models.Server, error) {
	server.UpdatedAt = time.Now().UnixMilli()

	if p.db.Model(models.Server{}).Where("ip LIKE ?", server.IP).Updates(server).RowsAffected == 0 {
		if server.ID == "" {
			server.ID = uuid.New().String()
		}
		if server.Token == "" {
			server.Token = UniqueToken(RandLength)
		}
		server.Enabled = true
		server.CreatedAt = time.Now().UnixMilli()
		p.db.Create(&server)
	}

	result := p.db.Model(models.Server{}).Where("ip LIKE ?", server.IP).Updates(server)

	if result.Error != nil {
		return server, result.Error
	}
	return server, nil
}

// ListServer to get list of users from database
func (p *provider) ListServer(ctx context.Context, pagination *models.Pagination) (*models.ServerList, error) {
	userId := ctx.Value(UserToken)
	var servers []models.Server
	result := p.db.Where(UserId+" = ?", userId).Limit(int(pagination.Limit)).Offset(int(pagination.Offset)).Order("created_at desc").Find(&servers)
	if result.Error != nil {
		return nil, result.Error
	}

	var total int64
	totalRes := p.db.Model(&models.Server{}).Where(UserId+" = ?", userId).Count(&total)
	if totalRes.Error != nil {
		return nil, totalRes.Error
	}
	paginationClone := pagination
	paginationClone.Total = total

	return &models.ServerList{
		Pagination: paginationClone,
		Data:       servers,
	}, nil
}

// ListServer  by Userid to get list of users from database
func (p *provider) ListServerByUserId(ctx context.Context, userId string) ([]models.Server, error) {
	var servers []models.Server
	result := p.db.Where(UserId+" = ?", userId).Find(&servers)
	if result.Error != nil {
		return nil, result.Error
	}

	serverList := []models.Server{}
	for _, request := range servers {
		serverList = append(serverList, request)
	}

	return serverList, nil
}

// GetServerById to update user information in database
func (p *provider) GetServerById(ctx context.Context, id string) (models.Server, error) {
	var server models.Server

	if id == "" {
		return server, errors.New(ReqIdMissing)
	}

	result := p.db.Where("id = ?", id).First(&server)
	if result.Error != nil {
		return server, result.Error
	}

	return server, nil
}

// DeleteServerById Request by id to update user information in database
func (p *provider) DeleteServerById(ctx context.Context, id string) error {
	userId := ctx.Value(UserToken)

	if id == "" {
		return errors.New(ReqIdMissing)
	}

	result := p.db.Where(UserId+" = ?", userId).Delete(&models.Server{
		ID: id,
	})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
