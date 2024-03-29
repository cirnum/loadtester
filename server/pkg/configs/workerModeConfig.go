package configs

type Config struct {
	Token           string `json:"token"`
	Port            string `json:"port"`
	MasterIp        string `json:"masterIp"`
	IP              string `json:"ip"`
	HostIp          string `json:"hostIp"`
	HostUrl         string `json:"hostUrl"`
	IsAwsAvailable  bool   `json:"isAwsAvailable"`
	AwsErrorMessage string `json:"awsErrorMessage"`
	IsSlave         bool   `json:"isSlave"`
}

type ConfigResponse struct {
	Data Config `json:"data"`
}

var ConfigProvider *Config

func Initialize(port string, token string, masterIp string) *Config {
	config := new(Config)
	config.MasterIp = masterIp
	config.Port = port
	config.Token = token
	config.IsSlave = true
	return config
}
