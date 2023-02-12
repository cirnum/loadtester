package services

import (
	"bufio"
	"fmt"
	"log"
	"os/exec"
	"strings"

	"github.com/manojown/api-testing-premium/app/model"
)

func Run(conf model.Configuration) string {
	// cmd := exec.Command("/usr/local/bin/gobench -u http://localhost:4000 -c 500 -t 10")
	cmdName := fmt.Sprintf("/usr/local/bin/gobench -u http://localhost:4000 -c %d -t %d", conf.Clients, conf.Time)
	// cmdName := ""
	cmdArgs := strings.Fields(cmdName)

	cmd := exec.Command(cmdArgs[0], cmdArgs[1:len(cmdArgs)]...)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Fatal(err)
	}
	cmd.Start()

	buf := bufio.NewReader(stdout) // Notice that this is not in a loop
	// num := 1
	// for {
	line, _, _ := buf.ReadLine()
	// if num > 2 {
	// 	os.Exit(0)
	// }
	// num += 1
	return string(line)
	// }
	// return "manoj"
}
