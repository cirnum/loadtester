package httpRequest

import (
	"context"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/executor"
	metrics "github.com/cirnum/loadtester/server/pkg/executor/metrics"
	"github.com/cirnum/loadtester/server/pkg/utils"
	log "github.com/sirupsen/logrus"
)

type RequestSend struct {
	cookies     map[string]string
	headers     map[string]string
	body        []byte
	url         string
	method      string
	statusCodes []int
}

type HttpClient struct {
	reqId     string
	client    *http.Client
	startTime int64
	requested *RequestSend
	title     struct {
		success   string
		fail      string
		otherFail string
		latency   string
	}
}

func Initializer(request models.Request) (HttpClient, error) {
	httpClient := HttpClient{
		title: struct{ success, fail, otherFail, latency string }{
			success:   ".http_ok",
			fail:      ".http_fail",
			otherFail: ".http_other_fail",
			latency:   ".latency",
		},
	}
	groups := []metrics.Group{{
		Name: "HTTP (" + request.ID + ")",
		Graphs: []metrics.Graph{
			{
				Title: "HTTP Response",
				Unit:  "N",
				Metrics: []metrics.Metric{
					{Title: httpClient.title.success, Type: metrics.Counter},
					{Title: httpClient.title.fail, Type: metrics.Counter},
					{Title: httpClient.title.otherFail, Type: metrics.Counter},
				},
			},
			{
				Title: "Latency",
				Unit:  "Microsecond",
				Metrics: []metrics.Metric{
					{Title: httpClient.title.latency, Type: metrics.Histogram},
				},
			},
		},
	}}

	client, err := utils.GetFormedHttpClient(request)
	if err != nil {
		return httpClient, err
	}
	httpClient.client = client

	requestedData := &RequestSend{
		url:         request.URL,
		method:      utils.GetSelectedMethods(request.Method),
		statusCodes: utils.GetStatusCodeIncludes(request.StatusCodeIncludes),
	}
	requestedData.headers, err = utils.GetFormedHeader(request.Headers)
	if err != nil {
		return httpClient, err
	}

	if request.PostData != nil && request.Method != http.MethodGet {
		requestedData.body, err = json.Marshal(request.PostData)
		if err != nil {
			return httpClient, err
		}
	}

	if err := executor.Setup(groups, request.ID); err != nil {
		return httpClient, err
	}

	httpClient.requested = requestedData
	return httpClient, nil
}

func (h *HttpClient) RunScen(ctx context.Context, conf models.Request) {
	finished := make(chan error)
	go func() {
		err := <-finished
		if err != nil {
			log.Error("Error:", err)
		}
	}()
	h.Manager(ctx, conf, finished)
}

func (h *HttpClient) Manager(ctx context.Context, conf models.Request, done chan<- error) {
	numOfClient := conf.Clients
	var throttle <-chan time.Time
	if conf.QPS > 0 {
		throttle = time.Tick(time.Duration(1e6/conf.QPS+1) * time.Microsecond)
	}
	var wg sync.WaitGroup
	wg.Add(numOfClient)
	h.startTime = time.Now().Unix()

	for j := 0; j < numOfClient; j++ {
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return
				default:
					if conf.QPS > 0 {
						<-throttle
					}
					h.Request()
				}
			}
		}()
	}
	wg.Wait()
	done <- nil
}

func (h *HttpClient) Request() ([]byte, error) {
	res, err := h.do(h.requested.method, h.requested.url, h.requested.body, h.requested.headers)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	buf, err := ioutil.ReadAll(res.Body)
	return buf, err
}

func (h *HttpClient) ignoreRes(verb string, url string, body []byte, headers map[string]string) error {
	res, err := h.do(verb, url, body, headers)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	io.Copy(ioutil.Discard, res.Body)
	return nil
}

func (h *HttpClient) do(method, url string, body []byte, headers map[string]string) (res *http.Response, err error) {
	begin := time.Now()
	defer func() {
		diff := time.Since(begin)
		executor.Notify(h.title.latency, diff.Microseconds())

		if err != nil {
			executor.Notify(h.title.otherFail, 1)
			return
		}

		statusOk := res.StatusCode >= 200 && res.StatusCode < 300
		if (len(h.requested.statusCodes) == 0 && statusOk) || utils.IsCodeExist(h.requested.statusCodes, res.StatusCode) {
			executor.Notify(h.title.success, 1)
		} else {
			executor.Notify(h.title.fail, 1)
		}
	}()

	req, err := http.NewRequest(method, url, strings.NewReader(string(body)))
	if err != nil {
		return nil, err
	}

	for k, v := range headers {
		req.Header.Add(k, v)
	}

	res, err = h.client.Do(req)
	return res, err
}

// Get makes http get request and record the metrics
func (h *HttpClient) Get(ctx context.Context) ([]byte, error) {
	return h.Request()
}

// GetIgnoreRes makes http get request, records the metrics, but ignore the
// responding body. Use this when you need high-speed traffic generation.
func (h *HttpClient) GetIgnoreRes() error {
	return h.ignoreRes(h.requested.method, h.requested.url, nil, h.requested.headers)
}

func (h *HttpClient) GetRequestHeaders(value []byte) map[string]string {
	var data map[string]string
	json.Unmarshal(value, &data)
	return data
}
