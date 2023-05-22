package models

type Loadster struct {
	ID        string  `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
	Count     int64   `json:"count,omitempty"`
	Type      string  `json:"type,omitempty"`
	Title     string  `json:"Title,omitempty"`
	Min       int64   `json:"min,omitempty"`
	Max       int64   `json:"max,omitempty"`
	Mean      float64 `json:"mean,omitempty"`
	Stddev    float64 `json:"stddev,omitempty"`
	Median    float64 `json:"median,omitempty"`
	P75       float64 `json:"p75,omitempty"`
	P95       float64 `json:"p95,omitempty"`
	P99       float64 `json:"p99,omitempty"`
	P999      float64 `json:"p999,omitempty"`
	ReqId     string  `json:"reqId,omitempty"`
	ServerId  string  `json:"serverId,omitempty"`
	Token     string  `json:"token,omitempty"`
	RPS       int64   `json:"rps" bson:"updated_at"`
	Created   int64   `json:"created" bson:"created"`
	UpdatedAt int64   `json:"updated_at" bson:"updated_at"`
	CreatedAt int64   `json:"created_at" bson:"created_at"`
	StartTime int64   `json:"startTime" bson:"startTime"`
	Finish    bool    `json:"finish" bson:"finish"`
}
