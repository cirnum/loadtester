package utils

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/pkg/errors"
	"gorm.io/datatypes"
)

var httpClient *http.Client

func init() {
	tr := &http.Transport{
		MaxIdleConnsPerHost: 300,
	}
	httpClient = &http.Client{
		Transport: tr,
		Timeout:   time.Second * 3,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
}

func Do(method, url string, body []byte, headers map[string]string) (*http.Response, error) {
	req, err := http.NewRequest(method, url, strings.NewReader(string(body)))
	if err != nil {
		return nil, err
	}
	// Add headers
	for k, v := range headers {
		req.Header.Add(k, v)
	}
	res, err := httpClient.Do(req)
	return res, err
}

func GetFormedMap(value []byte) map[string]string {
	var data map[string]string
	json.Unmarshal(value, &data)
	return data
}

func GetFormedHeader(headers datatypes.JSON) (map[string]string, error) {
	if headers != nil {
		headersValue, err := json.Marshal(headers)
		if err != nil {
			return nil, errors.New("Headers values seem incorrect. Please check and try again. Code: " + err.Error())
		}
		return GetFormedMap(headersValue), nil
	}
	return nil, nil
}

func GetStatusCodeIncludes(codes string) []int {
	if codes == "" {
		return []int{}
	}
	parts := strings.Split(codes, ",")
	numbers := make([]int, len(parts))
	for i, part := range parts {
		num, err := strconv.Atoi(part)
		if err != nil {
			log.Printf("Error converting %s to int: %v\n", part, err)
			return nil
		}
		numbers[i] = num
	}

	return numbers
}

func IsCodeExist(slice []int, target int) bool {
	for _, value := range slice {
		if value == target {
			return true
		}
	}
	return false
}
func GetSelectedMethods(method string) string {
	switch method {
	case "GET":
		return http.MethodGet
	case "POST":
		return http.MethodPost
	case "PATCH":
		return http.MethodPatch
	case "DELETE":
		return http.MethodDelete
	case "OPTIONS":
		return http.MethodOptions
	case "HEAD":
		return http.MethodHead
	case "PUT":
		return http.MethodPut
	default:
		return http.MethodGet
	}
}
