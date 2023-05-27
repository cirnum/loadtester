package models

import (
	"github.com/cirnum/loadtester/server/db/models"
)

type Request struct {
	ID        string      `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
	UserID    string      `json:"userID,omitempty"`
	URL       string      `json:"url"`
	Requests  int64       `json:"requests"`
	Time      int         `json:"time"`
	Clients   int         `json:"clients"`
	Headers   interface{} `json:"headers"`
	Params    interface{} `json:"params"`
	KeepAlive bool        `json:"keepAlive"`
	Method    string      `json:"method"`
	Ips       string      `json:"ips" bson:"ips"`
	PostData  interface{} `json:"postData,omitempty"`
	Created   int64       `json:"created" bson:"created"`
}

// type Server struct {
// 	UserID        primitive.ObjectID `bson:"userID,omitempty" json:"userID,omitempty"`
// 	Name          string             `json:"name" bson:"name"`
// 	Token         string             `json:"token" bson:"token"`
// 	ServerIP      string             `json:"serverIP" bson:"serverIP"`
// 	Port          string             `json:"port" bson:"port"`
// 	Created       int64              `json:"created" bson:"created"`
// 	DiskSpace     DiskSpace          `json:"diskSpace" bson:"diskSpace"`
// 	ServerOS      string             `json:"serverOS" bson:"serverOS"`
// 	RAM           MemStatus          `json:"ram" bson:"ram"`
// 	LastConnected int64              `json:"lastConnected" bson:"lastConnected"`
// 	CPU           CPUStatus          `json:"cpu" bson:"cpu"`
// }

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

type RequestResponse struct {
	StatusCode    int                 `json:"request"`
	Proto         string              `json:"proto"`
	Headers       map[string][]string `json:"headers"`
	Cookies       map[string]string   `json:"cookies"`
	Body          string              `json:"body"`
	ContentLength int64               `json:"contentLength"`
	Uncompressed  bool                `json:"uncompress"`
	TimeTaken     int64               `json:"timeTaken"`
}

type ResponsePayload struct {
	Request  models.Request  `json:"request"`
	Response RequestResponse `json:"response"`
}
