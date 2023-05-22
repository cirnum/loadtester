package utils

import (
	"net/http"
	"strings"
	"time"
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
