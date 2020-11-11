package main

import (
	"context"
	"fmt"
	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"

	//"github.com/singerdmx/BulletJournal/daemon/config"

	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
)

type ClientTestSuite struct {
	suite.Suite
}

func (suite *ClientTestSuite) SetupTest() {
	logging.InitLogging(config.GetEnv())
	serviceConfig := config.GetConfig()
	db := persistence.NewDB(serviceConfig)
	sampleTaskDao, _ := persistence.NewSampleTaskDao(ctx, db)
	restClient := resty.New()
	earningClient := investment.NewEarningsClient(sampleTaskDao, restClient)
	earningClient.ProcessData()
}

func (suite *ClientTestSuite) TestUpsert() {
	fmt.Println("In TestUpsert")
	//config.InitConfig()
	dbConfig := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s",
		"localhost", "postgres", "postgres", "docker")
	db := persistence.GetDB(dbConfig)
	sampleTaskDao := persistence.SampleTaskDao{
		Db: db,
		Ctx: context.Background(),
	}
	var st persistence.SampleTask
	//Find the last entry and make a new entry to upsert a new entry.
	sampleTaskDao.Db.Last(&st)
	st.ID += 1
	st.Uid = fmt.Sprint(st.ID)
	st.Name = st.Name + "_test_suffix"
	sampleTaskDao.Upsert(&st)
	var newSt persistence.SampleTask
	sampleTaskDao.Db.First(&newSt, st.ID)
	assert.Equal(suite.T(), newSt.Name, st.Name)
	sampleTaskDao.Db.Delete(&persistence.SampleTask{}, newSt.ID)

	//Randomly pick an entry and update it by using upsert.
	var allSts []*persistence.SampleTask
	sampleTaskDao.Db.Find(&allSts)
	count := len(allSts)
	var st2 persistence.SampleTask
	sampleTaskDao.Db.Take(&st2)
	oldContent := st2.Raw
	st2.Raw = oldContent + "_test_suffix"
	sampleTaskDao.Upsert(&st2)
	var updatedSt persistence.SampleTask
	sampleTaskDao.Db.First(&updatedSt, st2.ID)
	assert.NotEqual(suite.T(), updatedSt.Raw, oldContent)

	//Revert back the content
	st2.Raw = oldContent
	sampleTaskDao.Upsert(&st2)
	sampleTaskDao.Db.Find(&allSts)
	newCount := len(allSts)
	assert.Equal(suite.T(), count, newCount)
}

func (suite *ClientTestSuite) TestClient() {
	assert.True(suite.T(), true, true)
}


func TestClients(t *testing.T) {
	suite.Run(t, new(ClientTestSuite))
}