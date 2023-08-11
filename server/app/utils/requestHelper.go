package utils

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"time"

	log "github.com/sirupsen/logrus"

	helperModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/db/models"

	httpRequest "github.com/cirnum/loadtester/server/pkg/clients"
	"github.com/cirnum/loadtester/server/pkg/executor"
	"github.com/cirnum/loadtester/server/pkg/utils"
)

func RunExecutor(ctx context.Context, request models.Request) error {
	var client httpRequest.HttpClient
	executor := executor.NewExecutor(request.ID, "")
	ctx, cancelCtx := context.WithCancel(ctx)

	err := utils.RunWorker(request)
	if err != nil {
		log.Error("Error while sending request to Worker", err.Error())
		cancelCtx()
		return err
	}

	go func() {
		<-time.After(time.Duration(request.Time) * time.Second)
		cancelCtx()
	}()

	go executor.Run(ctx, request)
	client, err = httpRequest.Initializer(request)
	if err != nil {
		log.Error("Error while initiate http client", err.Error())
		cancelCtx()
		return err
	}

	go client.RunScen(ctx, request)
	return err
}

func TestRequest(request *models.Request) (helperModels.RequestResponse, error) {
	var response *http.Response
	var requestResponse helperModels.RequestResponse
	responseHeaders := make(map[string][]string)
	responseCookies := make(map[string]string)

	var body []byte
	method := utils.GetSelectedMethods(request.Method)
	headers, err := utils.GetFormedHeader(request.Headers)

	if err != nil {
		return requestResponse, err
	}

	if request.PostData != nil && request.Method != http.MethodGet {
		body, err = json.Marshal(request.PostData)
		if err != nil {
			return requestResponse, err
		}
	}
	startTime := time.Now().UnixNano() / int64(time.Millisecond)
	response, err = utils.Do(method, request.URL, body, headers)

	if err != nil {
		log.Error("Error while checking service is reachable or not", err.Error())
	}
	endTime := time.Now().UnixNano() / int64(time.Millisecond)

	if err != nil && response == nil {
		return requestResponse, err
	}
	requestResponse.TimeTaken = endTime - startTime
	requestResponse.Proto = response.Proto
	requestResponse.ContentLength = response.ContentLength
	requestResponse.Uncompressed = response.Uncompressed
	requestResponse.StatusCode = response.StatusCode

	for key, value := range response.Header {
		responseHeaders[key] = value
	}

	requestResponse.Headers = responseHeaders
	for _, cookie := range response.Cookies() {
		responseCookies[cookie.Name] = cookie.Value
	}
	requestResponse.Cookies = responseCookies

	defer response.Body.Close()

	buf, err := io.ReadAll(response.Body)

	requestResponse.Body = string(buf)

	return requestResponse, err
}
