package utils

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"strings"
	"time"
)

func GetIP() (string, error) {
	// Try to get the public IP
	publicIP, err := GetPublicIP()
	if err == nil && IsServerReachable(publicIP) {
		return publicIP, nil
	}

	// If public IP retrieval fails or is not reachable, try to get the local IP
	localIP, err := GetLocalIP()
	if err == nil {
		return localIP, nil
	}

	// If both public and local IP retrieval fail, return an error
	return "", fmt.Errorf("unable to determine IP")
}

func GetPublicIP() (string, error) {
	resp, err := http.Get("https://api64.ipify.org?format=text")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	ip, err := ReadBody(resp.Body)
	if err != nil {
		return "", err
	}

	return strings.TrimSpace(ip), nil
}

func GetLocalIP() (string, error) {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "", err
	}

	for _, addr := range addrs {
		ipNet, ok := addr.(*net.IPNet)
		if ok && !ipNet.IP.IsLoopback() && ipNet.IP.To4() != nil {
			return ipNet.IP.String(), nil
		}
	}

	return "", fmt.Errorf("no suitable local IP found")
}

func ReadBody(body io.Reader) (string, error) {
	buf := new(strings.Builder)
	_, err := io.Copy(buf, body)
	if err != nil {
		return "", err
	}
	return buf.String(), nil
}

func IsServerReachable(host string) bool {
	conn, err := net.DialTimeout("ip4:icmp", host, time.Second*5)
	if err != nil {
		return false
	}
	defer conn.Close()
	return true
}
