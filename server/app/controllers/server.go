package controllers

import (
	"context"
	"strings"
	"sync"

	_ "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/app/utils"
	pkgUtils "github.com/cirnum/loadtester/server/pkg/utils"

	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/constants"
	"github.com/gofiber/fiber/v2"
)

type WorkerInfo struct {
	IP string `json:"ip"`
}

const (
	invalidBody                  = constants.InvalidBody
	serverAddedSuccess           = "Server added successfully."
	serverUpdatedSuccess         = "Server Updated successfully."
	serverRetrievedSuccess       = "Server retrieved successfully."
	workerConfigRetrievedSuccess = "Get Worker config successfully."
	failedToRetrieveConfig       = "Failed to Get Worker config."
	serverDeletedSuccess         = "Server deleted successfully."
	failedToAddServer            = "Failed to add the server."
	failedToUpdateServer         = "Failed to update the server."
	failedToDeleteServer         = "Failed to delete the server."
	failedToUpdateServerList     = "Failed to update the server list."
	serverIdMissingToUpdate      = "Server id missing to update."
)

func GetServerDetails(c *fiber.Ctx) error {
	workerInfo := &WorkerInfo{}

	if err := c.BodyParser(workerInfo); err != nil {
		return utils.ResponseError(c, err, invalidBody, fiber.StatusInternalServerError)
	}
	workerConfig, err := pkgUtils.GetServerDetails(workerInfo.IP)
	if err != nil {
		return utils.ResponseError(c, err, failedToRetrieveConfig, 0)
	}
	return utils.ResponseSuccess(c, workerConfig, workerConfigRetrievedSuccess, 0)
}

// To Get all the Server
func GetAllServer(c *fiber.Ctx) error {
	ctx := context.WithValue(context.Background(), UserId, c.Locals(UserId).(string))

	pagination := utils.GetPagination(c)

	listServer, err := db.Provider.ListServer(ctx, &pagination)
	serverList := pkgUtils.ServerStatus(listServer)
	if err != nil {
		return utils.ResponseError(c, err, failedToAddServer, 0)
	}
	return utils.ResponseSuccess(c, serverList, serverAddedSuccess, 0)

}

// To Update server
func UpdateServer(c *fiber.Ctx) error {
	ctx := context.Background()
	serverPayload := &models.Server{}

	if err := c.BodyParser(serverPayload); err != nil {
		return utils.ResponseError(c, err, invalidBody, fiber.StatusInternalServerError)
	}

	if serverPayload.ID == "" {
		return utils.ResponseError(c, nil, serverIdMissingToUpdate, 0)
	}
	updatedServer, err := db.Provider.UpdateServer(ctx, *serverPayload)

	if err != nil {
		return utils.ResponseError(c, err, failedToUpdateServer, 0)
	}
	return utils.ResponseSuccess(c, updatedServer, serverUpdatedSuccess, 0)

}

func AddServer(c *fiber.Ctx) error {

	ctx := context.Background()
	serverPayload := &models.Server{}

	if err := c.BodyParser(serverPayload); err != nil {
		return utils.ResponseError(c, err, invalidBody, fiber.StatusInternalServerError)
	}

	serverPayload.UserID = c.Locals(UserId).(string)
	serverPayload.IP = strings.Trim(serverPayload.IP, " /")
	serverPayload.Enabled = true

	if pkgUtils.SendMasterIp(serverPayload.IP) {
		serverPayload.Active = true
	}
	server, err := db.Provider.AddServer(ctx, *serverPayload)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, server, serverAddedSuccess, fiber.StatusOK)
}

func GetServerById(c *fiber.Ctx) error {
	ctx := context.Background()
	id := c.Params("id")

	server, err := db.Provider.GetRequestById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, server, serverRetrievedSuccess, fiber.StatusOK)
}

func DeleteServerById(c *fiber.Ctx) error {
	id := c.Params("id")

	ctx := context.WithValue(context.Background(), UserId, c.Locals(UserId).(string))

	err := db.Provider.DeleteServerById(ctx, id)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, nil, serverDeletedSuccess, fiber.StatusOK)
}

// To Update server
func SyncServerWithMaster(c *fiber.Ctx) error {
	var wg sync.WaitGroup

	ctx := context.WithValue(context.Background(), UserId, c.Locals(UserId).(string))
	userId := c.Locals(UserId).(string)

	pagination := utils.GetPagination(c)

	ec2s, err := db.Provider.GetAllEc2s(ctx, &pagination)
	listServer, err := db.Provider.ListServer(ctx, &pagination)

	go pkgUtils.SyncWorker(listServer)

	success, _ := pkgUtils.SyncWithMaster(ec2s)
	serversToUpdate := pkgUtils.SaveEc2ToServer(success)

	wg.Add(len(serversToUpdate))
	for _, server := range serversToUpdate {
		go func(srv *models.Server) {
			srv.UserID = userId
			db.Provider.UpdateServerByIp(ctx, *srv)
			wg.Done()
		}(&server)
	}

	updatedListServer, err := db.Provider.ListServer(ctx, &pagination)
	serverList := pkgUtils.ServerStatus(updatedListServer)
	if err != nil {
		return utils.ResponseError(c, err, failedToUpdateServerList, 0)
	}
	return utils.ResponseSuccess(c, serverList, serverUpdatedSuccess, 0)
}
