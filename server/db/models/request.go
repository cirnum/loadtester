package models

import "gorm.io/datatypes"

//	type Request struct {
//		ID        string `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
//		UserID    string `json:"userID,omitempty"`
//		URL       string `json:"url"`
//		Requests  int64  `json:"requests"`
//		Time      int    `json:"time"`
//		Clients   int    `json:"clients"`
//		Headers   string `json:"headers"`
//		Params    string `json:"params"`
//		KeepAlive bool   `json:"keepAlive"`
//		Method    string `json:"method"`
//		Ips       string `json:"ips" bson:"ips"`
//		PostData  string `json:"postData,omitempty"`
//		UpdatedAt int64  `json:"updated_at" bson:"updated_at"`
//		CreatedAt int64  `json:"created_at" bson:"created_at"`
//	}
type Request struct {
	ID        string         `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
	UserID    string         `json:"userID,omitempty"`
	URL       string         `json:"url"`
	Requests  int64          `json:"requests"`
	Time      int            `json:"time"`
	Clients   int            `json:"clients"`
	Headers   datatypes.JSON `json:"headers"`
	Cookies   datatypes.JSON `json:"cookies"`
	QPS       int64          `json:"qps"`
	Params    datatypes.JSON `json:"params"`
	KeepAlive bool           `json:"keepAlive"`
	Method    string         `json:"method"`
	ServerId  string         `json:"serverId"`
	WorkerId  string         `json:"workerId"`
	Ips       string         `json:"ips" bson:"ips"`
	PostData  datatypes.JSON `json:"postData,omitempty"`
	Created   int64          `json:"created" bson:"created"`
	UpdatedAt int64          `json:"updated_at" bson:"updated_at"`
	CreatedAt int64          `json:"created_at" bson:"created_at"`
}

type RequestList struct {
	Pagination *Pagination `json:"pagination"`
	Data       []Request   `json:"data"`
}
