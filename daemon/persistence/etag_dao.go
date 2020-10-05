package persistence

import (
	"context"
	"encoding/json"
	"time"

	"github.com/go-redis/redis/v8"
)

const (
	EtagPrefix     string = "Etag"
	EtagTimeToLive        = 3600000 * time.Millisecond
)

type EtagDao struct {
	Ctx context.Context
	Rdb *redis.Client
}

func NewEtagDao(ctx context.Context, redisClient *redis.Client) *EtagDao {
	return &EtagDao{Ctx: ctx, Rdb: redisClient}
}

func (e *EtagDao) SingleCache(etag *Etag) {
	key := EtagPrefix + ":" + etag.Index
	b, err := json.Marshal(etag)
	if err != nil {
		log.Errorf("Etag encoding failed with %v", err)
		return
	}

	err = e.Rdb.Set(e.Ctx, key, string(b), EtagTimeToLive).Err()
	if err != nil {
		log.Errorf("Etag stored failed with %v", err)
		panic(err)
	}
}

func (e *EtagDao) BatchCache(etags []*Etag) {
	var values []string
	for _, etag := range etags {
		encoded, err := json.Marshal(etag)
		if err != nil {
			log.Errorf("Etag [%v] encoding failed with %v", etag.Index, err)
			continue
		}
		values = append(values, EtagPrefix+":"+etag.Index, string(encoded))
	}
	e.Rdb.MSet(e.Ctx, values)
}

func (e *EtagDao) FindEtagByIndex(index string) *Etag {
	key := EtagPrefix + ":" + index
	res, err := e.Rdb.Get(e.Ctx, key).Result()
	if err != nil {
		log.Errorf("Etag retrieval failed with %v", err)
		return nil
	}
	var etag Etag
	err = json.Unmarshal([]byte(res), &etag)
	if err != nil {
		log.Errorf("Etag decoding failed with %v", err)
		return nil
	}
	return &etag
}

func (e *EtagDao) FindEtagByUserName(username string, eType EtagType) *Etag {
	return e.FindEtagByIndex(username + "@" + eType.String())
}

func (e *EtagDao) DeleteEtagByUserName(username string) {
	for i := 0; i < 5; i++ {
		key := EtagPrefix + ":" + username + "@" + EtagType(i).String()
		e.DeleteByKey(key)
	}
}

func (e *EtagDao) DeleteEtagByUserNameAndEtagType(username string, eType EtagType) {
	key := EtagPrefix + ":" + username + "@" + eType.String()
	e.DeleteByKey(key)
}

func (e *EtagDao) DeleteByKey(key string) {
	e.Rdb.Del(e.Ctx, key)
}
