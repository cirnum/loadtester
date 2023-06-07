package models

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
	Enabled     bool   `json:"enabled"`
	UpdatedAt   int64  `json:"updated_at" bson:"updated_at"`
	CreatedAt   int64  `json:"created_at" bson:"created_at"`
}

type ServerList struct {
	Pagination *Pagination `json:"pagination"`
	Data       []Server    `json:"data"`
}
