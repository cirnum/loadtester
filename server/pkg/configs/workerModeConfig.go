package configs

type Config struct {
	Token    string
	Port     string
	MasterIp string
	IP       string
	HostIp   string
	IsSlave  bool
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
