package services

import (
	"encoding/json"
	"net/http"

	"github.com/manojown/api-testing-premium/app/model"
	log "github.com/sirupsen/logrus"
)

func ResponseWriter(res http.ResponseWriter, serviceName string, status int, message string, data interface{}) error {
	switch data.(type) {
	case error:
		log.WithFields(log.Fields{"message": message, "serviceName": serviceName}).Error(data)
	default:
		log.WithFields(log.Fields{"message": message, "serviceName": serviceName}).Info("Info")
	}

	if res != nil {
		res.WriteHeader(status)
		httpResponse := model.NewResponse(status, message, data)
		err := json.NewEncoder(res).Encode(httpResponse)
		return err
	}
	return nil
}
