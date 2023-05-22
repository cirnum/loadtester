package models

type Worker struct {
	ID        string  `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
	UserID    string  `json:"userID,omitempty"`
	ReqId     string  `json:"req_id"`
	ServerId  string  `json:"serverId"`
	Server    *Server `gorm:"foreignkey:ServerId" json:"server"`
	Status    bool    `json:"status"`
	Time      int     `json:"time"`
	Clients   int     `json:"clients"`
	Created   int64   `json:"created" bson:"created"`
	UpdatedAt int64   `json:"updated_at" bson:"updated_at"`
	CreatedAt int64   `json:"created_at" bson:"created_at"`
	Error     string  `json:"error" bson:"created_at"`
}

type WorkerList struct {
	Pagination *Pagination `json:"pagination"`
	Data       []Worker    `json:"data"`
}
