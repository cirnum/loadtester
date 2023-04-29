package config

import (
	"os"

	"github.com/go-redis/redis/v8"
)

type RedisConfig struct {
	Client *redis.Client
}

func (redisConfig *RedisConfig) initialize() {
	redisURL := os.Getenv("REDIS_URL")
	redisConfig.Client = redis.NewClient(&redis.Options{
		Addr:     redisURL,
		Password: "",
		DB:       0,
	})
}

func InitRedisConfig() *RedisConfig {
	config := new(RedisConfig)
	config.initialize()
	return config
}
