package handler

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"time"

	log "github.com/sirupsen/logrus"

	helpers "github.com/manojown/api-testing-premium/app/helper"
	"github.com/manojown/api-testing-premium/app/services"
	"github.com/manojown/api-testing-premium/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/manojown/api-testing-premium/app/model"
)

func UserRequest(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "UserRequest"
	var response []model.Configuration
	criteria := bson.M{"userID": DB.User.ID}
	_, options := helpers.ValidatePagination(r.URL.Query())

	result, err := DB.Find("request", response, criteria, &options)
	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Something went wrong while fetching your data.", err)
		return
	}

	d := result.([]model.Configuration)

	services.ResponseWriter(rw, methodName, http.StatusOK, "Request retrived successfully.", d)

}

func GetPerformance(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "GetPerformance"
	var testResponse []model.TestResponse
	criteria := bson.M{"userID": DB.User.ID}
	_, options := helpers.ValidatePagination(r.URL.Query())
	requestID, err := primitive.ObjectIDFromHex(r.URL.Query().Get("id"))

	if requestID != primitive.NilObjectID {
		criteria["requestID"] = requestID
	}

	result, err := DB.Find("result", testResponse, criteria, &options)
	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Something went wrong while fetching your data.", err.Error())
		return
	}
	services.ResponseWriter(rw, methodName, http.StatusOK, "All performance metrics retrived successfully.", result)

}

// NewSessionRequest is ...
func NewSessionRequest(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "NewSessionRequest"
	var response model.TestResponse
	var conf model.Configuration
	var paylodResponse model.PayloadResponder
	responseReciever := make(chan model.TestResponse, 1)

	err := json.NewDecoder(r.Body).Decode(&conf)

	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Please check your input, is it valid!", err.Error())
		return
	}
	requestID := helpers.CreateNewRequest(DB, conf)
	paylodResponse.Conf = conf
	paylodResponse.RequestID = requestID
	paylodResponse.UserID = DB.User.ID

	go func() {
		err, respon := helpers.ProcessRequest(DB, paylodResponse)
		if err != nil {
			log.Println("err", err)
		}
		services.ResponseWriter(nil, methodName, 1, "All Request SuccessFully sent to all saved server.", respon)
	}()

	go func() {

		processStartTime := time.Now()
		services.Initialize(&conf, responseReciever)
		response = <-responseReciever
		t := time.Now()

		response.TotalTimeTaken = int64(math.Ceil(t.Sub(processStartTime).Seconds()))
		response.PerSecond = response.SucessRequests / response.TotalTimeTaken
		response.ReadThroughput = response.ReadThroughput / response.TotalTimeTaken
		response.WriteThroughput = response.WriteThroughput / response.TotalTimeTaken
		response.URL = conf.URL
		response.Created = time.Now().Unix()
		response.RequestID = requestID
		helpers.InsertTestResult(DB, response)
	}()

	services.ResponseWriter(rw, methodName, http.StatusOK, "New request added, wait till you time entered. ", requestID)

}

func CreateServer(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "CreateServer"
	var server model.Server
	var dbServer model.Server

	Collection := DB.Collection("server")
	err := json.NewDecoder(r.Body).Decode(&server)

	checkErr(err)

	server.Token = helpers.RandSeq(8)
	server.Created = time.Now().Unix()
	server.UserID = DB.User.ID

	if server.Port == "" {
		server.Port = "3004" // replace with default port WIP need to create constant
	}

	err = Collection.FindOne(nil, bson.M{"serverIP": server.ServerIP, "userID": server.UserID}).Decode(&dbServer)

	if dbServer.ServerIP != "" {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "This server ip is already register with this user.", dbServer)
		return
	}

	insertionID, err := Collection.InsertOne(nil, server)

	if err != nil {
		fmt.Println("Error inserting", err)
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Error occured while server insertion,", err)
		return
	}

	services.ResponseWriter(rw, methodName, http.StatusOK, "New server created successfully.", insertionID)

}

func GetServer(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "GetServer"
	criteria := bson.M{"userID": DB.User.ID}
	_, options := helpers.ValidatePagination(r.URL.Query())
	var servers []model.Server

	result, err := DB.Find("server", servers, criteria, &options)
	servers = result.([]model.Server)
	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Something went wrong while fetching your data.", err.Error())
		return
	}

	services.ResponseWriter(rw, methodName, http.StatusOK, "Server's retrived successfully.", servers)

}

func GetServerRespone(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "GetServerRespone"
	var payloadReciever model.PayloadReciever
	var response model.TestResponse

	err := json.NewDecoder(r.Body).Decode(&payloadReciever)
	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Issue while parsing reponse, please check request perameters.", err)
		return
	}
	response = payloadReciever.TestResponse
	response.RequestURL = response.URL
	response.UserID = payloadReciever.UserID
	response.RequestID = payloadReciever.RequestID
	response.Responder = payloadReciever.Responder
	insertionID := helpers.InsertTestResult(DB, response)
	message := fmt.Sprintf("Response Recieved from remote server where Responder:%s and Requested url:%s", response.Responder, response.URL)
	services.ResponseWriter(rw, methodName, http.StatusInternalServerError, message, insertionID)
}

func Connector(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "Connector"
	var server model.Server
	_ = json.NewDecoder(r.Body).Decode(&server)

	Collection := DB.Collection("server")
	update := bson.M{
		"$set": bson.M{
			"diskSpace":     server.DiskSpace,
			"ram":           server.RAM,
			"cpu":           server.CPU,
			"lastConnected": server.LastConnected,
		},
	}
	message := fmt.Sprintf("Connector response recieved from token:%s", server.Token)
	_, err := Collection.UpdateOne(nil, bson.M{"token": server.Token}, update)

	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, message, err)
		return
	}
	services.ResponseWriter(rw, methodName, http.StatusOK, message, server)
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func GetPerformanceByUrl(DB *config.DbConfig, rw http.ResponseWriter, r *http.Request) {
	var methodName string = "GetPerformanceByUrl"
	var data model.PerformanceCriteria
	criteria := bson.M{"userID": DB.User.ID}
	var performance []model.TestResponse
	_, options := helpers.ValidatePagination(r.URL.Query())
	err := json.NewDecoder(r.Body).Decode(&data)

	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Please check you params, It should be valid id.", err)
		return
	}

	if data.Url != "" {
		criteria["url"] = data.Url
	}

	result, err := DB.Find("result", performance, criteria, &options)
	performance = result.([]model.TestResponse)

	if err != nil {
		services.ResponseWriter(rw, methodName, http.StatusInternalServerError, "Something went wrong while fetching your data.", err)
		return
	}
	services.ResponseWriter(rw, methodName, http.StatusOK, "All performance by url  retrived successfully.", performance)

}

// func checkError(rw http.ResponseWriter, err error, message string) {
// 	if err != nil {
// 		if message != "" {
// 			services.ResponseWriter(rw, http.StatusInternalServerError, message, err.Error())
// 		} else {
// 			services.ResponseWriter(rw, http.StatusInternalServerError, err.Error(), err.Error())
// 		}
// 	}
// }
