package services

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
	"os/signal"
	"reflect"
	"sync"
	"sync/atomic"
	"time"

	"github.com/manojown/api-testing-premium/app/model"
	"github.com/valyala/fasthttp"
)

var total int
var kb int64 = 1024
var myClient fasthttp.Client

type Result struct {
	request       int64
	success       int64
	failed        int64
	networkFailed int64
	badFailed     int64
	responseTime  int64
}

var readThroughput int64
var writeThroughput int64

type MyConn struct {
	net.Conn
}

func (this *MyConn) Read(b []byte) (n int, err error) {
	len, err := this.Conn.Read(b)

	if err == nil {
		atomic.AddInt64(&readThroughput, int64(len))
	}
	return len, err
}

func (this *MyConn) Write(b []byte) (n int, err error) {
	len, err := this.Conn.Write(b)

	if err == nil {
		atomic.AddInt64(&writeThroughput, int64(len))
	}

	return len, err
}

func printResult(results map[int]*Result, sentResponse chan<- model.TestResponse, URL string) {

	var testResult model.TestResponse

	for _, result := range results {
		testResult.TotalRequests += result.request
		testResult.SucessRequests += result.success
		testResult.FailedRequests += result.badFailed
		testResult.NetworkFailed += result.networkFailed
		testResult.ResponseTime += result.responseTime

	}
	testResult.URL = URL
	testResult.RequestURL = URL
	testResult.Responder, _ = os.Hostname()
	testResult.ReadThroughput = readThroughput
	testResult.WriteThroughput = writeThroughput
	if testResult.ResponseTime > 0 && testResult.SucessRequests > 0 {
		testResult.ResponseTime = testResult.ResponseTime / testResult.SucessRequests
	}

	sentResponse <- testResult

}
func Initialize(conf *model.Configuration, sentResponse chan<- model.TestResponse) {

	var done sync.WaitGroup
	results := make(map[int]*Result)
	timout := make(chan bool, 1)
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt)
	go func() {
		_ = <-sig
		printResult(results, sentResponse, conf.URL)

	}()

	go func() {
		<-timout
		conf.Requests = 0
		fmt.Println("Time Over")

	}()
	go func() {
		<-time.After(time.Duration(conf.Time) * time.Second)
		timout <- true
	}()
	conf.Requests = int64((1 << 63) - 1)
	myClient.ReadTimeout = time.Duration(10000) * time.Millisecond
	myClient.WriteTimeout = time.Duration(10000) * time.Millisecond
	myClient.MaxConnsPerHost = conf.Clients
	myClient.Dial = MyDialer()

	fmt.Printf("Dispatching %d clients.\n", conf.Clients)
	done.Add(conf.Clients)
	for i := 0; i < conf.Clients; i++ {
		result := &Result{}
		results[i] = result
		go client(result, conf, &done)
	}
	done.Wait()
	printResult(results, sentResponse, conf.URL)

}

func client(result *Result, conf *model.Configuration, done *sync.WaitGroup) {

	for result.request < conf.Requests {
		doRequest(conf.URL, result, conf)
	}
	done.Done()

}

func MyDialer() func(address string) (conn net.Conn, err error) {
	return func(address string) (net.Conn, error) {
		conn, err := net.Dial("tcp", address)
		if err != nil {
			return nil, err
		}
		myConn := &MyConn{Conn: conn}

		return myConn, nil
	}
}
func doRequest(url string, result *Result, conf *model.Configuration) {
	req := fasthttp.AcquireRequest()
	req.SetRequestURI(url)
	req.Header.SetMethodBytes([]byte(conf.Method))
	setHeader(conf.Headers, req)
	if conf.KeepAlive == true {
		req.Header.Set("Connection", "keep-alive")
	} else {
		req.Header.Set("Connection", "close")
	}

	if conf.Method != "GET" {
		d, _ := json.Marshal(conf.PostData)
		req.SetBody(d)
	}

	resp := fasthttp.AcquireResponse()
	processStartTime := time.Now()
	// response.TotalTimeTaken =

	err := myClient.Do(req, resp)

	t := time.Now()
	responseTime := t.Sub(processStartTime).Microseconds()
	// log.Println("respon is:::", resp.Time)
	statusCode := resp.StatusCode()
	result.request++
	fasthttp.ReleaseRequest(req)
	fasthttp.ReleaseResponse(resp)
	if err != nil {
		result.networkFailed++
		return
	}
	if statusCode == fasthttp.StatusOK || statusCode == fasthttp.StatusMovedPermanently {
		result.responseTime += responseTime
		result.success++

	} else {
		result.badFailed++
	}

}

func setHeader(data interface{}, req *fasthttp.Request) {
	v := reflect.ValueOf(data)
	if v.Kind() == reflect.Map {
		for _, key := range v.MapKeys() {
			req.Header.Add(key.Interface().(string), v.MapIndex(key).Interface().(string))
		}
	}
}
