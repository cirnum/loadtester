package models

type User struct {
	ID        string `gorm:"primaryKey;type:char(36)" bson:"_id,omitempty" json:"id,omitempty"`
	Name      string `json:"name" bson:"name"`
	Email     string `gorm:"unique" json:"email" bson:"email"`
	Password  string `json:"password,omitempty" bson:"password,omitempty"`
	UpdatedAt int64  `json:"updated_at" bson:"updated_at"`
	CreatedAt int64  `json:"created_at" bson:"created_at"`
}

type AuthResponse struct {
	Xo    string `json:"xo"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Users struct {
	Pagination *Pagination `json:"pagination"`
	Users      []User      `json:"users"`
}
