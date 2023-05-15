package config

type Config struct {
	Token    string
	Port     string
	MasterIp string
}

func Initialize(port string, masterIp string, token string) *Config {
	config := new(Config)
	config.MasterIp = masterIp
	config.Port = port
	config.Token = token
	return config
}
