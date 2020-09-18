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
	var values []string
	for _, etag := range etags {
		json, _ := json.Marshal(etag)
		values = append(values, Prefix+":"+etag.Index, string(json))
	}
	e.Rdb.MSet(e.Ctx, values)
}

func (e *EtagDao) FindEtagByIndex(index string) *Etag {
	key := Prefix + ":" + index
	res, err := e.Rdb.Get(e.Ctx, key).Result()
	if err != nil {
		return nil
	}
	var etag Etag
	json.Unmarshal([]byte(res), &etag)
	return &etag
}

func (e *EtagDao) FindEtagByUserName(username string, eType EtagType) *Etag {
	return e.FindEtagByIndex(username + "@" + eType.String())
}

func (e *EtagDao) DeleteEtagByUserName(username string) {
	for i := 0; i < 5; i++ {
		key := Prefix + ":" + username + "@" + EtagType(i).String()
		e.DeleteByKey(key)
	}
}

func (e *EtagDao) DeleteEtagByUserNameAndEtagType(username string, eType EtagType) {
	key := Prefix + ":" + username + "@" + eType.String()
	e.DeleteByKey(key)
}

func (e *EtagDao) DeleteByKey(key string) {
	e.Rdb.Del(e.Ctx, key)
}
