package handler

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"

	"github.com/cirnum/strain-hub/server/cli/config"
	"github.com/cirnum/strain-hub/server/db/models"
)

// NewSessionRequest is ...
func RunRequest(config *config.Config, w http.ResponseWriter, r *http.Request) {
	IPAddress := r.Header.Get("X-Real-Ip")
	var request models.Request
	json.NewDecoder(r.Body).Decode(&request)

	// title := "Run Requester"
	fmt.Fprintf(w, "You've requested for: %s\n", IPAddress)

}

func Ping(config *config.Config, w http.ResponseWriter, r *http.Request) {
	// title := "Ping"
	allIp := []string{}
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		os.Stderr.WriteString("Oops: " + err.Error() + "\n")
		os.Exit(1)
	}

	for _, a := range addrs {
		if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				os.Stdout.WriteString(ipnet.IP.String() + "\n")
				allIp = append(allIp, ipnet.IP.String())
			}
		}
	}
	fmt.Fprintf(w, "You've requested for: %s\n", allIp)
}
