package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
	"time"

	helper "github.com/cirnum/strain-hub/app/helper"
	"github.com/cirnum/strain-hub/app/model"
	"github.com/cirnum/strain-hub/app/services"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	"github.com/cirnum/strain-hub/config"
)

const (
	Unauthorized        string = "You are authorized person."
	GetAllUserMethod    string = "GetAllUser"
	RegisterationMethod string = "Registeration"
	LoginMethod         string = "Login"
	ErrorWhileRetriving string = "Error while retriving all users."
	UserRetriveSuccess  string = "User retrived successfully."
	AlreadyRegister     string = "User is already register with same Email Address."
	InsertionFailed     string = "Something went wrong while insertion."
	UserCreated         string = "User created successfully."
	RegisterationError  string = "Register with other email address."
	NotRegister         string = "You are not register with us."
	IncorrectEmailPass  string = "Email or password incorrect."
	CommonError         string = "Something went wrong."
	UserLoggedIn        string = "User loggedIn successfully."
)

// Collection Name
const (
	USER string = "user"
)

var (
	reqCount int = 0
)

func Test(provider config.Provider, rw http.ResponseWriter, r *http.Request) {
	reqCount += 1
	fmt.Println("Req number : ", reqCount, runtime.NumGoroutine())
	time.Sleep(100 * time.Microsecond)
	json.NewEncoder(rw).Encode(Unauthorized)
}

func GetAllUser(provider config.Provider, rw http.ResponseWriter, r *http.Request) {
	var DB = provider.DB

	var dbUsers []model.User
	options := options.FindOptions{}
	options.SetProjection(bson.D{{"_id", 1}, {"email", 1}, {"name", 1}})

	result, err := DB.Find(USER, dbUsers, bson.M{}, &options)

	if err != nil {
		services.ResponseWriter(rw, GetAllUserMethod, http.StatusOK, ErrorWhileRetriving, err)
		return
	}
	result = result.([]model.User)
	services.ResponseWriter(rw, GetAllUserMethod, http.StatusOK, UserRetriveSuccess, result)
}

func Registeration(provider config.Provider, rw http.ResponseWriter, r *http.Request) {
	var DB = provider.DB
	var user model.User
	var dbUser model.User

	json.NewDecoder(r.Body).Decode(&user)

	user.Password = helper.GetHash([]byte(user.Password))
	Collection := DB.Collection(USER)

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	Collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&dbUser)

	if dbUser.Email == user.Email {
		services.ResponseWriter(rw, RegisterationMethod, http.StatusConflict, AlreadyRegister, RegisterationError)
		return
	}
	result, err := Collection.InsertOne(nil, user)
	if err != nil {
		services.ResponseWriter(rw, RegisterationMethod, http.StatusInternalServerError, InsertionFailed, err)
		return
	}
	services.ResponseWriter(rw, RegisterationMethod, http.StatusOK, UserCreated, result)

}

func Login(provider config.Provider, response http.ResponseWriter, request *http.Request) {
	var DB = provider.DB
	var user model.User
	var dbUser model.User
	var tokenResponse model.AuthResponse

	err := json.NewDecoder(request.Body).Decode(&user)
	Collection := DB.Collection(USER)

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = Collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&dbUser)

	if dbUser.Email == "" {
		services.ResponseWriter(response, LoginMethod, http.StatusInternalServerError, NotRegister, err)
		return
	}

	userPass := []byte(user.Password)
	dbPassBuffered := []byte(dbUser.Password)

	passErr := bcrypt.CompareHashAndPassword(dbPassBuffered, userPass)

	if passErr != nil {
		services.ResponseWriter(response, LoginMethod, http.StatusInternalServerError, IncorrectEmailPass, passErr)
		return
	}
	jwtToken, err := helper.GenerateJWT(dbUser)
	if err != nil {
		services.ResponseWriter(response, LoginMethod, http.StatusInternalServerError, CommonError, err)
		return
	}
	tokenResponse.Xo = jwtToken
	tokenResponse.Email = dbUser.Email
	tokenResponse.Name = dbUser.Name
	services.ResponseWriter(response, LoginMethod, http.StatusOK, UserLoggedIn, tokenResponse)
}
