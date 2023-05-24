package sql

import (
	"context"
	"errors"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/google/uuid"
)

// AddServer to update user information in database
func (p *provider) AddWorker(ctx context.Context, worker models.Worker) (models.Worker, error) {
	if worker.ID == "" {
		worker.ID = uuid.New().String()
	}
	worker.CreatedAt = time.Now().Unix()
	worker.UpdatedAt = time.Now().Unix()

	result := p.db.Create(&worker)

	if result.Error != nil {
		return worker, result.Error
	}

	return worker, nil
}

// AddServer to update user information in database
func (p *provider) UpdateWorker(ctx context.Context, worker models.Worker) (models.Worker, error) {
	worker.UpdatedAt = time.Now().Unix()

	result := p.db.Save(&worker)
	if result.Error != nil {
		return worker, result.Error
	}
	return worker, nil
}

// Update worker status by serverid
func (p *provider) UpdateWorkerStatusBySId(ctx context.Context, worker *models.Worker) (*models.Worker, error) {

	result := p.db.Model(&worker).Where("server_id = ? AND req_id = ?", worker.ServerId, worker.ReqId).Updates(&worker)
	if result.Error != nil {
		return worker, result.Error
	}
	return worker, nil
}

// ListServer to get list of users from database
func (p *provider) ListWorker(ctx context.Context, pagination *models.Pagination) (*models.WorkerList, error) {
	userId := ctx.Value("userId")
	var workers []models.Worker
	result := p.db.Where("user_id = ?", userId).Limit(int(pagination.Limit)).Offset(int(pagination.Offset)).Order("created_at DESC").Find(&workers)
	if result.Error != nil {
		return nil, result.Error
	}

	workerList := []models.Worker{}
	for _, worker := range workers {
		workerList = append(workerList, worker)
	}

	var total int64
	totalRes := p.db.Model(&models.Request{}).Count(&total)
	if totalRes.Error != nil {
		return nil, totalRes.Error
	}

	paginationClone := pagination
	paginationClone.Total = total

	return &models.WorkerList{
		Pagination: paginationClone,
		Data:       workerList,
	}, nil
}

// GetServerById to update user information in database
func (p *provider) GetWorkerById(ctx context.Context, id string) (models.Worker, error) {
	var worker models.Worker

	if id == "" {
		return worker, errors.New("Worker id missing.")
	}

	result := p.db.Where("id = ?", id).First(&worker)
	if result.Error != nil {
		return worker, result.Error
	}

	return worker, nil
}

// Get worker by reqId
func (p *provider) GetWorkerByReqId(ctx context.Context, id string) ([]models.Worker, error) {
	var workers []models.Worker

	if id == "" {
		return workers, errors.New("Request id missing.")
	}

	result := p.db.Joins("Server", p.db.Select("Alias", "Description", "IP", "CreatedAt")).Where("req_id = ?", id).Find(&workers)

	if result.Error != nil {
		return workers, result.Error
	}

	return workers, nil
}
