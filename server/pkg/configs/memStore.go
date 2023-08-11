package configs

import (
	"os"
)

type Store struct {
	AWS_ACCESS_KEY            string
	AWS_SECRET_KEY            string
	JWT_SECRET_KEY            string
	AWS_REGION                string
	HostUrl                   string
	DB_DNS                    string
	DB_TYPE                   string
	STAGE_STATUS              string
	SERVER_HOST               string
	PORT                      string
	SERVER_READ_TIMEOUT       string
	AWS_INTEGRATION_AVAILABEL string
}

var StoreProvider *Store

func StoreInitialize() Store {
	store := &Store{
		JWT_SECRET_KEY:      "723bhhghv23466v6234bvhahhdvvasd727364364bd7",
		DB_DNS:              "loadtester-db",
		DB_TYPE:             "sqlite",
		SERVER_HOST:         "0.0.0.0",
		PORT:                "3005",
		SERVER_READ_TIMEOUT: "60",
		HostUrl:             "",
	}

	if os.Getenv("HOST_URL") != "" {
		store.HostUrl = os.Getenv("HOST_URL")
	}
	if os.Getenv("JWT_SECRET_KEY") != "" {
		store.JWT_SECRET_KEY = os.Getenv("JWT_SECRET_KEY")
	}
	if os.Getenv("DB_DNS") != "" {
		store.DB_DNS = os.Getenv("DB_DNS")
	}
	if os.Getenv("DB_TYPE") != "" {
		store.DB_TYPE = os.Getenv("DB_TYPE")
	}
	if os.Getenv("STAGE_STATUS") != "" {
		store.STAGE_STATUS = os.Getenv("STAGE_STATUS")
	}
	if os.Getenv("PORT") != "" {
		store.PORT = os.Getenv("PORT")
	}

	store.AWS_ACCESS_KEY = os.Getenv("AWS_ACCESS_KEY")
	store.AWS_SECRET_KEY = os.Getenv("AWS_SECRET_KEY")
	store.AWS_REGION = os.Getenv("AWS_REGION")

	StoreProvider = store
	return *StoreProvider
}

func (store *Store) IsAwsAvailable() (bool, string) {
	var errMsg string = ""
	if store.AWS_ACCESS_KEY == "" {
		errMsg += "AWS_ACCESS_KEY, "
	}
	if store.AWS_SECRET_KEY == "" {
		errMsg += "AWS_SECRET_KEY, "
	}
	if store.AWS_REGION == "" {
		errMsg += "AWS_REGION missing in env, please add this env to support aws integration. "
	}
	if store.AWS_ACCESS_KEY == "" || store.AWS_SECRET_KEY == "" || store.AWS_REGION == "" {
		return false, errMsg
	}
	return true, errMsg
}
