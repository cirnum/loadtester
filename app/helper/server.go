package helpers

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/manojown/api-testing-premium/app/model"
	"github.com/manojown/api-testing-premium/app/services"
	"github.com/manojown/api-testing-premium/config"
	"github.com/valyala/fasthttp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateNewRequest(DB *config.DbConfig, newRequest model.Configuration) primitive.ObjectID {
	var methodName string = "CreateNewRequest"
	Collection := DB.Collection("request")
	newRequest.UserID = DB.User.ID
	newRequest.Created = time.Now().Unix()
	result, err := Collection.InsertOne(nil, newRequest)
	if err != nil {
		services.ResponseWriter(nil, methodName, 1, "Having issue while insering the test result", err)
		return primitive.NilObjectID
	}
	return result.InsertedID.(primitive.ObjectID)
}

func InsertTestResult(DB *config.DbConfig, response model.TestResponse) primitive.ObjectID {
	var methodName string = "InsertTestResult"
	Collection := DB.Collection("result")
	response.UserID = DB.User.ID
	result, err := Collection.InsertOne(nil, response)
	if err != nil {
		services.ResponseWriter(nil, methodName, 1, "Having issue while insering the test result", err)
		return primitive.NilObjectID
	}
	return result.InsertedID.(primitive.ObjectID)
}

func apiCall(url string, method string, data []byte) {
	var methodName string = "apiCall"
	req := fasthttp.AcquireRequest()
	req.SetRequestURI(url)
	req.Header.SetMethodBytes([]byte(method))
	req.SetBody(data)
	resp := fasthttp.AcquireResponse()
	err := fasthttp.Do(req, resp)
	statusCode := resp.StatusCode()
	fasthttp.ReleaseRequest(req)
	fasthttp.ReleaseResponse(resp)
	if err != nil {
		services.ResponseWriter(nil, methodName, 1, "networkFailed error", err)
	}

	if statusCode == fasthttp.StatusOK || statusCode == fasthttp.StatusMovedPermanently {
		messaage := fmt.Sprintf("Rquest sent to the server successfully for: http://%s:%s", url, method)
		services.ResponseWriter(nil, methodName, 1, messaage, resp)
	} else {
		services.ResponseWriter(nil, methodName, 1, "Something went wrong from server please check server config.", errors.New(string(data)))
	}

}

func ProcessRequest(DB *config.DbConfig, payload model.PayloadResponder) (error, bool) {
	var methodName string = "ProcessRequest"
	var allIps []model.Server
	criteria := bson.M{
		"userID": DB.User.ID,
	}

	result, err := DB.Find("server", allIps, criteria, nil)

	if err != nil {
		return err, false
	}

	allIps = result.([]model.Server)

	for index, _ := range allIps {
		payload.Responder = allIps[index].ServerIP
		addr := fmt.Sprintf("sent data for processing to http://%s:%s/test", payload.Responder, allIps[index].Port)
		services.ResponseWriter(nil, methodName, 1, addr, err)
		dataToSent, err := json.Marshal(payload)
		if err != nil {
			services.ResponseWriter(nil, methodName, 1, "error while marshal json.", err)
			return err, false
		}
		apiCall(addr, "POST", dataToSent)
	}
	return nil, true
}
