package daos

import (
	"context"
	"encoding/json"
	"time"

	"github.com/go-redis/redis/v8"

	"github.com/singerdmx/BulletJournal/daemon/daos/models"
	"github.com/singerdmx/BulletJournal/daemon/logging"
)

var log logging.Logger

const (
	Prefix     string        = "Etag"
	timeToLive time.Duration = 3600000 * time.Millisecond
)

type EtagDao struct {
	Ctx context.Context
	Rdb *redis.Client
}

func (e *EtagDao) SingleCache(etag *models.Etag) {
	key := Prefix + ":" + etag.Index
	b, err := json.Marshal(etag)
	if err != nil {
		log.Errorf("Etag encoding failed with %v", err)
		return
	}

	err = e.Rdb.Set(e.Ctx, key, string(b), timeToLive).Err()
	if err != nil {
		log.Errorf("Etag stored failed with %v", err)
		panic(err)
	}
}

func (e *EtagDao) BatchCache(etags []*models.Etag) {
	var values []string
	for _, etag := range etags {
		encoded, err := json.Marshal(etag)
		if err != nil {
			log.Errorf("Etag [%v] encoding failed with %v", etag.Index, err)
			continue
		}
		values = append(values, Prefix+":"+etag.Index, string(encoded))
	}
	e.Rdb.MSet(e.Ctx, values)
}

func (e *EtagDao) FindEtagByIndex(index string) *models.Etag {
	key := Prefix + ":" + index
	res, err := e.Rdb.Get(e.Ctx, key).Result()
	if err != nil {
		log.Errorf("Etag retrieval failed with %v", err)
		return nil
	}
	var etag models.Etag
	err = json.Unmarshal([]byte(res), &etag)
	if err != nil {
		log.Errorf("Etag decoding failed with %v", err)
		return nil
	}
	return &etag
}

func (e *EtagDao) FindEtagByUserName(username string, eType models.EtagType) *models.Etag {
	return e.FindEtagByIndex(username + "@" + eType.String())
}

func (e *EtagDao) DeleteEtagByUserName(username string) {
	for i := 0; i < 5; i++ {
		key := Prefix + ":" + username + "@" + models.EtagType(i).String()
		e.DeleteByKey(key)
	}
}

func (e *EtagDao) DeleteEtagByUserNameAndEtagType(username string, eType models.EtagType) {
	key := Prefix + ":" + username + "@" + eType.String()
	e.DeleteByKey(key)
}

func (e *EtagDao) DeleteByKey(key string) {
	e.Rdb.Del(e.Ctx, key)
}
