package controllers

import (
	"context"
	"fmt"
	"time"

	"github.com/cirnum/strain-hub/server/app/utils"
	"github.com/cirnum/strain-hub/server/db"
	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

var value int64 = 0

func Ping(c *fiber.Ctx) error {
	value++
	return utils.ResponseSuccess(c, "Pong.", constants.LoginMethod, 0)
}

func Pong(c *fiber.Ctx) error {
	return utils.ResponseSuccess(c, value, constants.LoginMethod, 0)
}

// To Get all the users
func GetAllUser(c *fiber.Ctx) error {
	ctx := context.Background()
	listUsers, err := db.Provider.ListUsers(ctx, models.Pagination{
		Limit:  10,
		Offset: 0,
	})

	if err != nil {
		return utils.ResponseError(c, err, constants.ErrorWhileRetriving, 0)
	}
	return utils.ResponseSuccess(c, listUsers, constants.UserRetriveSuccess, 0)

}

// Register new user
func SingUp(c *fiber.Ctx) error {
	var err error

	ctx := context.Background()
	user := &models.User{}
	userResponse := models.User{}

	// Check, if received JSON data is valid.
	if err := c.BodyParser(user); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}
	user.Password, err = utils.GetHash([]byte(user.Password))

	if err != nil {
		return utils.ResponseError(c, err, constants.CommonError, fiber.StatusInternalServerError)
	}

	insertedUser, err := db.Provider.AddUser(ctx, *user)

	userResponse.Email = insertedUser.Email
	userResponse.Name = insertedUser.Name
	userResponse.ID = insertedUser.ID

	if err != nil {
		return utils.ResponseError(c, err, err.Error(), fiber.StatusInternalServerError)
	}

	return utils.ResponseSuccess(c, userResponse, constants.UserCreated, fiber.StatusOK)
}

// Login
func SingIn(c *fiber.Ctx) error {
	var err error

	userBody := &models.User{}
	var tokenResponse models.AuthResponse

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	// Check, if received JSON data is valid.
	if err := c.BodyParser(userBody); err != nil {
		return utils.ResponseError(c, err, constants.InvalidBody, fiber.StatusInternalServerError)
	}

	user, err := db.Provider.GetUserByEmail(ctx, userBody.Email)

	if user.Email == "" {
		return utils.ResponseError(c, fmt.Errorf(constants.NotRegister), constants.NotRegister, fiber.StatusNotFound)
	}

	userPass := []byte(userBody.Password)
	dbPassBuffered := []byte(user.Password)

	passErr := bcrypt.CompareHashAndPassword(dbPassBuffered, userPass)

	if passErr != nil {
		return utils.ResponseError(c, fmt.Errorf(constants.IncorrectEmailPass), constants.IncorrectEmailPass, fiber.StatusUnauthorized)
	}

	jwtToken, err := utils.GenerateJWT(user)
	if err != nil {
		return utils.ResponseError(c, fmt.Errorf(constants.CommonError), constants.CommonError, fiber.StatusInternalServerError)
	}
	tokenResponse.Xo = jwtToken
	tokenResponse.Email = user.Email
	tokenResponse.Name = user.Name
	return utils.ResponseSuccess(c, tokenResponse, constants.UserLoggedIn, 0)
}
