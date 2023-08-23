// Package controllers provides functions to handle HTTP requests related to EC2 instances.
package controllers

import (
	"context"
	"strings"

	"github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/app/utils"
	"github.com/cirnum/loadtester/server/db"
	"github.com/cirnum/loadtester/server/pkg/constants"
	"github.com/gofiber/fiber/v2"
)

// Constants for response messages.
const (
	KeyCreateMSG         = "Key created successfuly."
	GetKeyMSG            = "Get keys successfuly."
	EC2CreatedMSG        = "EC2 Created successfuly."
	GetEC2MSG            = "Get Running EC2 successfuly."
	AlreadyTerminatedMSG = "Seems instance is already in terminated state."
	InstanceTerminated   = "Instance terminated successfuly."
	UserId               = "userId"
	NotFound             = "NotFound"
	Terminated           = "terminated"
)

// CreatePemKey creates a new PEM key.
func CreatePemKey(c *fiber.Ctx) error {
	err := utils.CreatePem()

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, KeyCreateMSG, KeyCreateMSG, fiber.StatusOK)
}

// GetPemKey returns all the PEM keys.
func GetPemKey(c *fiber.Ctx) error {
	keyPairs, err := utils.GetKeyPair()

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, keyPairs, GetKeyMSG, fiber.StatusOK)
}

// CreateEC2 creates a new EC2 instance.
func CreateEC2(c *fiber.Ctx) error {
	var ec2Options models.CreateEC2Options
	ctx := context.Background()
	if err := c.BodyParser(&ec2Options); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}
	userId := c.Locals(UserId).(string)
	allCreatedEc2, err := utils.CreateEC2(ec2Options, userId)
	workerData, err := db.Provider.CreateEC2(ctx, allCreatedEc2)
	go utils.JobScheduler(workerData)
	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, workerData, EC2CreatedMSG, fiber.StatusOK)
}

// GetRunningEC2 returns all the running EC2 instances.
func GetRunningEC2(c *fiber.Ctx) error {
	ctx := context.WithValue(context.Background(), UserId, c.Locals(UserId).(string))

	pagination := utils.GetPagination(c)
	ec2s, err := db.Provider.GetAllEc2s(ctx, &pagination)

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, ec2s, GetEC2MSG, fiber.StatusOK)
}

// TerminateEC2 terminates the specified EC2 instances.
func TerminateEC2(c *fiber.Ctx) error {
	ctx := context.Background()
	var instanceIdsList models.InstanceIdList

	if err := c.BodyParser(&instanceIdsList); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	err := utils.TerminateEC2(instanceIdsList.InstanceIds)
	if err != nil && strings.Contains(err.Error(), NotFound) {
		err = db.Provider.UpdateEc2Status(ctx, instanceIdsList.InstanceIds, Terminated, -1)
		return utils.ResponseError(c, err, AlreadyTerminatedMSG, fiber.StatusInternalServerError)
	} else {
		err = db.Provider.UpdateEc2Status(ctx, instanceIdsList.InstanceIds, Terminated, -1)
	}

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}
	return utils.ResponseSuccess(c, instanceIdsList, InstanceTerminated, fiber.StatusOK)
}
