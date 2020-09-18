package daos

import (
	"context"
	"encoding/json"
	log "github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/daemon/models"
	"time"

	"github.com/go-redis/redis/v8"
)

const (
	JoinGroupResponsePrefix     string = "JoinGroupResponse"
	JoinGroupResponseTimeToLive        = 3600000 * time.Millisecond
)

type JoinGroupResponseDao struct {
	Ctx context.Context
	Rdb *redis.Client
}

func (j *JoinGroupResponseDao) SingleCache(joinGroupResponse *models.JoinGroupResponse) {
	key := JoinGroupResponsePrefix + ":" + joinGroupResponse.Uid
	b, err := json.Marshal(joinGroupResponse.Username)
	if err != nil {
		log.Errorf("JoinGroupResponse encoding failed with %v", err)
		return
	}

	err = j.Rdb.Set(j.Ctx, key, string(b), JoinGroupResponseTimeToLive).Err()
	if err != nil {
		log.Errorf("JoinGroupResponse stored failed with %v", err)
		panic(err)
	}
}

func (j *JoinGroupResponseDao) Find(uid string) *models.JoinGroupResponse {
	key := JoinGroupResponsePrefix + ":" + uid
	res, err := j.Rdb.Get(j.Ctx, key).Result()
	if err != nil {
		log.Errorf("JoinGroupResponse retrieval failed with %v", err)
		return nil
	}
	var joinGroupResponse models.JoinGroupResponse
	err = json.Unmarshal([]byte(res), &joinGroupResponse)
	if err != nil {
		log.Errorf("JoinGroupResponse decoding failed with %v", err)
		return nil
	}
	return &joinGroupResponse
}
