package dao

import (
	"context"
	"encoding/json"
	"time"

	"github.com/go-redis/redis/v8"
)

const (
	Prefix     string        = "Etag"
	timeToLive time.Duration = 3600000 * time.Millisecond
)

type EtagDao struct {
	Ctx context.Context
	Rdb *redis.Client
}

func (e *EtagDao) SingleCache(etag *Etag) {
	key := Prefix + ":" + etag.Index
	b, err := json.Marshal(etag)
	if err != nil {
		return
	}

	err = e.Rdb.Set(e.Ctx, key, string(b), timeToLive).Err()
	if err != nil {
		panic(err)
	}
}

func (e *EtagDao) BatchCache(etags []*Etag) {
	for _, etag := range etags {
		e.SingleCache(etag)
	}
}

func (e *EtagDao) FindEtagByIndex(index string) *Etag {
	key := Prefix + ":" + index
	res, err := e.Rdb.Get(e.Ctx, key).Result()
	if err != nil {
		panic(err)
	}
	var etag Etag
	json.Unmarshal([]byte(res), &etag)
	// fmt.Println("etag: ", etag)
	return &etag
}

func (e *EtagDao) FindEtagByUserName(username string, eType EtagType) *Etag {
	return e.FindEtagByIndex(username + "@" + eType.String())
}
