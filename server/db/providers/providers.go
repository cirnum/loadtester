package providers

import (
	"context"

	"github.com/cirnum/strain-hub/server/db/models"
)

type Provider interface {
	// AddUser to save user information in database
	AddUser(ctx context.Context, user models.User) (models.User, error)
	// UpdateUser to update user information in database
	UpdateUser(ctx context.Context, user models.User) (models.User, error)
	// DeleteUser to delete user information from database
	DeleteUser(ctx context.Context, user models.User) error
	// ListUsers to get list of users from database
	ListUsers(ctx context.Context, pagination models.Pagination) (*models.Users, error)
	// GetuserByEmail
	GetUserByEmail(ctx context.Context, email string) (models.User, error)
	// Add New Request
	AddRequest(ctx context.Context, request models.Request) (models.Request, error)
	// Request List
	RequestList(ctx context.Context, pagination *models.Pagination) (*models.RequestList, error)
	// Get request by id
	GetRequestById(ctx context.Context, id string) (models.Request, error)
	// Delete request by id
	DeleteRequestById(ctx context.Context, id string) error
	// Add Load
	AddLoadByRequestId(ctx context.Context, load models.Loadster) (models.Loadster, error)
	// Get load
	GetLoadByRequestId(ctx context.Context, pagination models.Pagination, requestId string) ([]models.Loadster, error)
	// Add server
	AddServer(ctx context.Context, server models.Server) (models.Server, error)
	// UpdateUser to update user information in database
	UpdateServer(ctx context.Context, server models.Server) (models.Server, error)
	// Update server by ServerID
	UpdateWorkerStatusBySId(ctx context.Context, worker *models.Worker) (*models.Worker, error)
	// DeleteUser to delete user information from database
	DeleteServerById(ctx context.Context, id string) error
	// ListUsers to get list of users from database
	ListServer(ctx context.Context, pagination *models.Pagination) (*models.ServerList, error)
	// server by UserId
	ListServerByUserId(ctx context.Context, userId string) ([]models.Server, error)
	// GetuserByEmail
	GetServerById(ctx context.Context, email string) (models.Server, error)
	// Add Worker
	AddWorker(ctx context.Context, worker models.Worker) (models.Worker, error)
	// Update Worker
	UpdateWorker(ctx context.Context, worker models.Worker) (models.Worker, error)
	// Get a list of workers
	ListWorker(ctx context.Context, pagination *models.Pagination) (*models.WorkerList, error)
	//  Get worker by id
	GetWorkerById(ctx context.Context, id string) (models.Worker, error)
	// get worker by req id
	GetWorkerByReqId(ctx context.Context, id string) ([]models.Worker, error)
}
