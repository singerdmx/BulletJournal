package persistence

import (
	"github.com/go-redis/redis/v8"
	"github.com/singerdmx/BulletJournal/daemon/config"
)

type RedisClient struct {
}

func GetRedisClient(serviceConfig *config.Config) *redis.Client {
	settings := &redis.Options{
		Addr:     serviceConfig.Host + ":" + serviceConfig.RedisPort,
		Password: "", // no password set
		DB:       0,  // use default DB
	}
	return redis.NewClient(settings)
}
