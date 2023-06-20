package configs

import "os"

type Store struct {
	AWS_ACCESS_KEY      string
	AWS_SECRET_KEY      string
	JWT_SECRET_KEY      string
	AWS_REGION          string
	HostUrl             string
	DB_DNS              string
	DB_TYPE             string
	STAGE_STATUS        string
	SERVER_HOST         string
	PORT                string
	SERVER_READ_TIMEOUT string
}

var StoreProvider *Store

func StoreInitialize() {
	store := new(Store)
	store.AWS_ACCESS_KEY = os.Getenv("AWS_ACCESS_KEY")
	store.AWS_SECRET_KEY = os.Getenv("AWS_SECRET_KEY")
	store.JWT_SECRET_KEY = os.Getenv("JWT_SECRET_KEY")
	store.AWS_REGION = os.Getenv("AWS_REGION")
	store.DB_DNS = os.Getenv("DB_DNS")
	store.DB_TYPE = os.Getenv("DB_TYPE")
	store.STAGE_STATUS = os.Getenv("STAGE_STATUS")
	store.SERVER_HOST = "0.0.0.0"
	store.PORT = os.Getenv("PORT")
	StoreProvider = store
}
