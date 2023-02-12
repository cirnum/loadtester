package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type TestResponse struct {
	UserID          primitive.ObjectID `json:"userID" bson:"userID"`
	RequestID       primitive.ObjectID `json:"requestID" bson:"requestID"`
	URL             string             `json:"url" bson:"url"`
	Responder       string             `json:"responder" bson:"responder"`
	RequestURL      string             `json:"requestUrl" bson:"requestUrl"`
	TotalTimeTaken  int64              `json:"totalTime" bson:"totalTime"`
	TotalRequests   int64              `json:"totalRequests" bson:"totalRequests"`
	SucessRequests  int64              `json:"sucessRequests" bson:"sucessRequests"`
	FailedRequests  int64              `json:"failedRequest" bson:"failedRequest"`
	NetworkFailed   int64              `json:"networkFailed" bson:"networkFailed"`
	WriteThroughput int64              `json:"writeThroughput" bson:"writeThroughput"`
	ReadThroughput  int64              `json:"readThroughput" bson:"readThroughput"`
	PerSecond       int64              `json:"perSecond" bson:"perSecond"`
	Created         int64              `json:"created" bson:"created"`
	ResponseTime    int64              `json:"responseTime" bson:"responseTime"`
}

type Response struct {
	Status  int         `json:"status,omitempty"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}
type ResponseLogging struct {
	Response Response `json:"response,omitempty"`
	Method   string   `json:"methd,omitempty"`
}

func NewResponse(status int, Message string, data interface{}) *Response {

	return &Response{
		Status:  status,
		Message: Message,
		Data:    data,
	}

}
