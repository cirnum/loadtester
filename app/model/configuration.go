package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Configuration struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    primitive.ObjectID `bson:"userID,omitempty" json:"userID,omitempty"`
	URL       string             `json:"url" bson:"url,omitempty"`
	Requests  int64              `json:"requests" bson:"requests"`
	Time      int                `json:"time" bson:"time"`
	Clients   int                `json:"clients" bson:"clients"`
	Headers   interface{}        `json:"headers" bson:"headers"`
	KeepAlive bool               `json:"keepAlive" bson:"keepAlive"`
	Method    string             `json:"method" bson:"method"`
	Ips       []string           `json:"ips" bson:"ips"`
	PostData  interface{}        `json:"postData,omitempty" bson:"postData"`
	Created   int64              `json:"created" bson:"created"`
}

type Server struct {
	UserID        primitive.ObjectID `bson:"userID,omitempty" json:"userID,omitempty"`
	Name          string             `json:"name" bson:"name"`
	Token         string             `json:"token" bson:"token"`
	ServerIP      string             `json:"serverIP" bson:"serverIP"`
	Port          string             `json:"port" bson:"port"`
	Created       int64              `json:"created" bson:"created"`
	DiskSpace     DiskSpace          `json:"diskSpace" bson:"diskSpace"`
	ServerOS      string             `json:"serverOS" bson:"serverOS"`
	RAM           MemStatus          `json:"ram" bson:"ram"`
	LastConnected int64              `json:"lastConnected" bson:"lastConnected"`
	CPU           CPUStatus          `json:"cpu" bson:"cpu"`
}

type PayloadReciever struct {
	UserID       primitive.ObjectID `json:"userID"`
	RequestID    primitive.ObjectID `json:"requestID"`
	Responder    string             `json:"responder"`
	TestResponse TestResponse       `json:"testResponse"`
}

type PayloadResponder struct {
	UserID    primitive.ObjectID `json:"userID"`
	RequestID primitive.ObjectID `json:"requestID"`
	Responder string             `json:"responder"`
	Conf      Configuration      `json:"conf"`
}
type ConnectionData struct {
	Topic    string `json:"topic" bson:"usage"`
	ServerIP string `json:"serverIP" bson:"serverIP"`
}

type DiskSpace struct {
	All  uint64 `json:"all" bson:"all"`
	Used uint64 `json:"used" bson:"used"`
	Free uint64 `json:"free" bson:"free"`
}

type CPUStatus struct {
	Cores int     `json:"cores" bson:"cores"`
	Usage float64 `json:"usage" bson:"usage"`
}
type MemStatus struct {
	All  uint64 `json:"all" bson:"all"`
	Used uint64 `json:"used" bson:"used"`
	Free uint64 `json:"free" bson:"free"`
}

type PerformanceCriteria struct {
	Url string `json:"url"`
}
