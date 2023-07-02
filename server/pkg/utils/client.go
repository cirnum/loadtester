package utils

import (
	"encoding/json"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
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
		Timeout:   time.Second * 2,
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

func GetFormedHttpClient(request models.Request) (*http.Client, error) {
	var cookiesBucket []*http.Cookie

	// Verify if the URL is correct
	parsedUrl, err := url.Parse(request.URL)
	if err != nil {
		return nil, errors.New("Please pass a valid URL")
	}

	jar, _ := cookiejar.New(nil)

	if request.Cookies != nil {
		cookiesValue, err := json.Marshal(request.Cookies)
		if err != nil {
			return nil, errors.New("Cookies values seem incorrect. Please check and try again. Code: " + err.Error())
		}
		cookieData := GetFormedMap(cookiesValue)
		for k, v := range cookieData {
			v = strings.ReplaceAll(v, `"`, `'`)
			cookie := &http.Cookie{
				Name:  k,
				Value: v,
			}
			cookiesBucket = append(cookiesBucket, cookie)
		}
	}

	jar.SetCookies(parsedUrl, cookiesBucket)

	tr := &http.Transport{
		MaxIdleConnsPerHost: 300,
	}
	return &http.Client{
		Transport: tr,
		Timeout:   time.Second * 5,
		Jar:       jar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}, nil
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
