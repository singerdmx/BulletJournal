package main

// Basic imports
import (
	"context"
	"log"
	"strconv"
	"testing"

	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/daemon/persistence"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

var ctx = context.Background()

// Define the suite, and absorb the built-in basic suite
// functionality from testify - including a T() method which
// returns the current testing context
type RedisTestSuite struct {
	suite.Suite
	Pong string
}

func testRedisClient(etagDao *persistence.EtagDao, suite *RedisTestSuite) {
	pong, err := etagDao.Rdb.Ping(etagDao.Ctx).Result()
	if err != nil {
		return
	}
	log.Println("pong: ", pong)
	assert.Equal(suite.T(), "PONG", pong)

	etagDao.Rdb.FlushAll(etagDao.Ctx)
}

func testSingleCache(etagDao *persistence.EtagDao, suite *RedisTestSuite) {
	var username = "gaaralmn"
	var etype = persistence.NotificationType
	var etagname = "etag_sample"
	etag := persistence.GenerateEtag(username, etype, etagname)
	etagDao.SingleCache(etag)
	etag2 := etagDao.FindEtagByUserName(username, etype)
	log.Println("etag2: ", etag2)
	assert.Equal(suite.T(), etag, etag2)

	etagDao.Rdb.FlushAll(etagDao.Ctx)
}

func testBatchCache(etagDao *persistence.EtagDao, suite *RedisTestSuite) {
	var username = "gaaralmn"
	var etagname = "etag_sample"
	var etags []*persistence.Etag
	for i := 0; i < 5; i++ {
		suffix := "_" + strconv.Itoa(i)
		etags = append(etags, persistence.GenerateEtag(username+suffix, persistence.EtagType(i), etagname+suffix))
	}
	etagDao.BatchCache(etags)
	//Validate persisted data
	for _, etag := range etags {
		etag2 := etagDao.FindEtagByIndex(etag.Index)
		log.Println("etag2: ", etag2)
		assert.Equal(suite.T(), etag, etag2)
	}

	etagDao.Rdb.FlushAll(etagDao.Ctx)
}

func testDeleteByKey(etagDao *persistence.EtagDao, suite *RedisTestSuite) {
	var username = "gaaralmn"
	var etype = persistence.NotificationType
	var etagname = "etag_sample"
	etag := persistence.GenerateEtag(username, etype, etagname)
	etagDao.SingleCache(etag)
	etagDao.DeleteEtagByUserNameAndEtagType(username, etype)
	etag2 := etagDao.FindEtagByUserName(username, etype)
	assert.Equal(suite.T(), etag2, (*persistence.Etag)(nil))

	etagDao.Rdb.FlushAll(etagDao.Ctx)
}

func testDeleteByUserName(etagDao *persistence.EtagDao, suite *RedisTestSuite) {
	var username = "gaaralmn"
	var etagname = "etag_sample"
	var etags []*persistence.Etag
	for i := 0; i < 5; i++ {
		suffix := "_" + strconv.Itoa(i)
		etags = append(etags, persistence.GenerateEtag(username, persistence.EtagType(i), etagname+suffix))
	}
	etagDao.BatchCache(etags)

	var cursor uint64
	var keys []string
	keys, _, _ = etagDao.Rdb.Scan(ctx, cursor, "Etag:gaaralmn*", 10).Result()
	assert.Equal(suite.T(), len(keys), 5)

	etagDao.DeleteEtagByUserName(username)

	keys, _, _ = etagDao.Rdb.Scan(ctx, cursor, "Etag:gaaralmn*", 10).Result()
	log.Println("keys: ", keys)

	assert.Equal(suite.T(), len(keys), 0)

	etagDao.Rdb.FlushAll(etagDao.Ctx)
}

// Make sure that VariableThatShouldStartAtFive is set to five
// before each test
func (suite *RedisTestSuite) SetupTest() {
	config.InitConfig()
	serviceConfig := config.GetConfig()
	logging.InitLogging(config.GetEnv())

	//etagDao := persistence.InitializeEtagDao(ctx, serviceConfig)
	etagDao := persistence.NewEtagDao(ctx, persistence.GetRedisClient(serviceConfig))
	//Check health of redis connection
	testRedisClient(etagDao, suite)
	//Test persisting single entity
	testSingleCache(etagDao, suite)
	//Test persisting entities in batch
	testBatchCache(etagDao, suite)
	//Test delete by username and etype
	testDeleteByKey(etagDao, suite)
	//Test delete by username
	testDeleteByUserName(etagDao, suite)
	//TODO clean up redis after test
	etagDao.Rdb.FlushAll(ctx)
}

// All methods that begin with "Test" are run as tests within a
// suite.
func (suite *RedisTestSuite) TestRedis() {
	// assert.Equal(suite.T(), "PONG", suite.Pong)
	// assert.Equal(suite.T(), uint64(1), *suite.RestPublicProjectItems)
	// assert.Equal(suite.T(), uint64(2), *suite.RestNotifications)
}

// In order for 'go test' to run this suite, we need to create
// a normal test function and pass our suite to suite.Run
func TestRedisTestSuite(t *testing.T) {
	suite.Run(t, new(RedisTestSuite))
}
