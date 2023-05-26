package utils

import (
	"encoding/json"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"reflect"
	"strings"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
)

func Do(method, url string, body []byte, headers map[string]string) (
	res *http.Response, err error,
) {
	tr := &http.Transport{
		MaxIdleConnsPerHost: 300,
	}
	client := &http.Client{
		Transport: tr,
		Timeout:   time.Second * 5,
	}
	req, err := http.NewRequest(method, url, strings.NewReader(string(body)))

	if err != nil {
		return
	}
	// add headers
	if headers != nil {
		for k, v := range headers {
			req.Header.Add(k, v)
		}
	}
	res, err = client.Do(req)

	return
}

func GetFormedHttpClient(request models.Request) (*http.Client, error) {
	var cookiesBucket []*http.Cookie

	// To verify url is correct or not
	parsedUrl, err := url.Parse(request.URL)
	if err != nil {
		return nil, errors.New("Please Pass the valid url")
	}

	jar, _ := cookiejar.New(nil)

	if request.Cookies != nil {
		cookiesValue, err := json.Marshal(request.Cookies)
		if err != nil {
			return nil, errors.New("Cookies values seems not correct, please check and try again. Code : " + err.Error())
		}
		cookieData := GetFormedMap(cookiesValue)
		for k, v := range cookieData {
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
		Timeout:   time.Second * 10,
		Jar:       jar,
	}, nil
}

func GetFormedMap(value []byte) map[string]string {
	var data interface{}
	json.Unmarshal(value, &data)
	headers := make(map[string]string)
	v := reflect.ValueOf(data)
	if v.Kind() == reflect.Map {
		for _, key := range v.MapKeys() {
			headers[key.Interface().(string)] = v.MapIndex(key).Interface().(string)
		}
	}
	return headers
}

func GetFormedHeader(headers datatypes.JSON) (map[string]string, error) {
	if headers != nil {
		headersValue, err := json.Marshal(headers)
		if err != nil {
			return nil, errors.New("Headers values seems not correct, please check and try again. Code : " + err.Error())
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
