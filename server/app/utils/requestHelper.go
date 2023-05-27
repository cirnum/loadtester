package utils

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"

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
	go func() {
		<-time.After(time.Duration(request.Time) * time.Second)
		cancelCtx()
	}()

	err := utils.RunWorker(request)
	if err != nil {
		log.Println("Error while sending request to Worker", err)
		return err
	}

	go executor.Run(ctx, request)
	client, err = httpRequest.Initializer(request)
	if err != nil {
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
	endTime := time.Now().UnixNano() / int64(time.Millisecond)

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

	buf, err := ioutil.ReadAll(response.Body)

	requestResponse.Body = string(buf)

	return requestResponse, err
}
