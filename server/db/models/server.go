package models

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
type Server struct {
	ID          string `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
	Alias       string `json:"alias,omitempty"`
	Description string `json:"description,omitempty"`
	UserID      string `json:"userId,omitempty"`
	IP          string `json:"ip"`
	Port        int64  `json:"port"`
	Token       string `json:"token"`
	Active      bool   `json:"active"`
	Interval    int    `json:"interval"`
	UpdatedAt   int64  `json:"updated_at" bson:"updated_at"`
	CreatedAt   int64  `json:"created_at" bson:"created_at"`
}

type ServerList struct {
	Pagination *Pagination `json:"pagination"`
	Data       []Server    `json:"data"`
}
