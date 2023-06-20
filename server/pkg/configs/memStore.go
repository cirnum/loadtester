package configs

import "os"

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
