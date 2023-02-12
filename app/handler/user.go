package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	helper "github.com/manojown/api-testing-premium/app/helper"
	"github.com/manojown/api-testing-premium/app/model"
	"github.com/manojown/api-testing-premium/app/services"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	"github.com/manojown/api-testing-premium/config"
)

func Test(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {

	json.NewEncoder(rw).Encode("You are authorized person.")

}

func GetAllUser(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "GetAllUser"

	var dbUsers []model.User
	options := options.FindOptions{}
	options.SetProjection(bson.D{{"_id", 1}, {"email", 1}, {"name", 1}})

	result, err := DB.Find("user", dbUsers, bson.M{}, &options)

	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusOK, "Error while retriving all users.", err)
		return
	}
	result = result.([]model.User)
	services.ResponseWriter(rw, methodName, http.StatusOK, "User retrived successfully.", result)
}

func Registeration(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "GetAllUser"
	var user model.User
	var dbUser model.User

	json.NewDecoder(r.Body).Decode(&user)

	user.Password = helper.GetHash([]byte(user.Password))
	Collection := DB.Collection("user")

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	Collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&dbUser)

	if dbUser.Email == user.Email {
		services.ResponseWriter(rw, methodName, http.StatusConflict, "User is already register with same Email Address.", "Register with other email address.")
		return
	}
	result, err := Collection.InsertOne(nil, user)
	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Something went wrong while insertion.", err)
		return
	}
	services.ResponseWriter(rw, methodName, http.StatusOK, "User created successfully.", result)

}

func Login(DB *config.DbConfig, response http.ResponseWriter, request *http.Request) {
	var methodName string = "Login"

	var user model.User
	var dbUser model.User

	err := json.NewDecoder(request.Body).Decode(&user)
	Collection := DB.Collection("user")

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = Collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&dbUser)

	if dbUser.Email == "" {
		services.ResponseWriter(response, methodName, http.StatusInternalServerError, "You are not register with us.", err)
		return
	}

	userPass := []byte(user.Password)
	dbPassBuffered := []byte(dbUser.Password)

	passErr := bcrypt.CompareHashAndPassword(dbPassBuffered, userPass)

	if passErr != nil {
		services.ResponseWriter(response, methodName, http.StatusInternalServerError, "Email or password incorrect.", passErr)
		return
	}
	jwtToken, err := helper.GenerateJWT(dbUser)
	if err != nil {
		services.ResponseWriter(response, methodName, http.StatusInternalServerError, "Something went wrong.", err)
		return
	}

	services.ResponseWriter(response, methodName, http.StatusOK, "User loggedIn successfully.", jwtToken)
}
