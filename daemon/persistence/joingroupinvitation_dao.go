package persistence

import (
	"context"
	"encoding/json"
	"time"

	"github.com/go-redis/redis/v8"
)

const (
	JoinGroupInvitationPrefix     string = "JoinGroupInvitation"
	JoinGroupInvitationTimeToLive        = 3600000 * time.Millisecond
)

type JoinGroupInvitationDao struct {
	Ctx context.Context
	Rdb *redis.Client
}

func NewJoinGroupInvitationDao(ctx context.Context, redisClient *redis.Client) *JoinGroupInvitationDao {
	return &JoinGroupInvitationDao{Ctx: ctx, Rdb: redisClient}
}

func (j *JoinGroupInvitationDao) SingleCache(joinGroupInvitation *JoinGroupInvitation) {
	key := JoinGroupInvitationPrefix + ":" + joinGroupInvitation.Uid
	b, err := json.Marshal(joinGroupInvitation)
	if err != nil {
		log.Errorf("JoinGroupInvitation encoding failed with %v", err)
		return
	}

	err = j.Rdb.Set(j.Ctx, key, string(b), JoinGroupInvitationTimeToLive).Err()
	if err != nil {
		log.Errorf("JoinGroupInvitation stored failed with %v", err)
		panic(err)
	}
}

func (j *JoinGroupInvitationDao) Find(uid string) *JoinGroupInvitation {
	key := JoinGroupInvitationPrefix + ":" + uid
	res, err := j.Rdb.Get(j.Ctx, key).Result()
	if err != nil {
		log.Errorf("JoinGroupInvitation retrieval failed with %v", err)
		return nil
	}
	var joinGroupInvitation JoinGroupInvitation
	err = json.Unmarshal([]byte(res), &joinGroupInvitation)
	if err != nil {
		log.Errorf("JoinGroupInvitation decoding failed with %v", err)
		return nil
	}
	return &joinGroupInvitation
}
