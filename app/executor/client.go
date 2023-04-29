package executor

import (
	metrics "github.com/cirnum/strain-hub/app/executor/matrics"
)

type ClientConnector interface {
	Setup(groups []metrics.Group, reqId string) error
	Notify(title string, value int64) error
}

var clientConnectInstance ClientConnector

func init() {
	clientConnectInstance = &executorInstance
}

func getClientConnectInstance() ClientConnector {
	return clientConnectInstance
}

// Setup is used for the driver to report the metrics that it will generate
func Setup(groups []metrics.Group, reqId string) error {
	clientConnect := getClientConnectInstance()

	return clientConnect.Setup(groups, reqId)
}

// Notify saves the id with value into metrics which later save to database
// Return error when the title is not found from the metric list.
// The not found error may occur because
// a. The title has never ever register before
// b. The session is cancel but the scenario does not handle the ctx.Done signal
func Notify(title string, value int64) error {
	clientConnect := getClientConnectInstance()

	return clientConnect.Notify(title, value)
}

// SetClientConnect setup new clientConnectInstance. Use to support testing only
func SetClientConnect(cc ClientConnector) error {
	clientConnectInstance = cc
	return nil
}
