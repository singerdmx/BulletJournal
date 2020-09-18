package clients

import (
	"context"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

type RedisClient struct {
	Settings redis.Options
}

func (rc *RedisClient) GetClient() *redis.Client {
	return redis.NewClient(&rc.Settings)
}
