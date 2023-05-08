package models

type Pagination struct {
	Limit  int64 `json:"limit"`
	Page   int64 `json:"page"`
	Offset int64 `json:"offset"`
	Total  int64 `json:"total"`
}
