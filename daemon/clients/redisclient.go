package clients

import (
	"github.com/go-redis/redis/v8"
)

type RedisClient struct {
	Settings redis.Options
}

func (rc *RedisClient) RedisClient() *redis.Client {
	return redis.NewClient(&rc.Settings)
}
