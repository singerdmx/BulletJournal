package main

import (
	"context"
	"fmt"
	"github.com/singerdmx/BulletJournal/daemon/clients/investment"

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
	earningClient,_ := investment.NewTemplateClient(investment.IPOTemplate)
	earningClient.FetchData()
	earningClient.SendData()
}

func (suite *ClientTestSuite) TestUpsert() {
	fmt.Println("In TestUpsert")
	//config.InitConfig()
	//serviceConfig := config.GetConfig()
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
	fmt.Printf("In TestUpsert, old SampleTask is %v\n", st)
	st.ID += 1
	st.Name = st.Name + "_test_suffix"
	fmt.Printf("In TestUpsert, new SampleTask is %v\n", st)
	sampleTaskDao.Upsert(&st)
	var newSt persistence.SampleTask
	sampleTaskDao.Db.First(&newSt, st.ID)
	assert.Equal(suite.T(), newSt.Name, st.Name)
	sampleTaskDao.Db.Delete(&persistence.SampleTask{}, newSt.ID)

	//Randomly pick an entry and update it by using upsert.
	var allSts []*persistence.SampleTask
	sampleTaskDao.Db.Find(&allSts)
	count := len(allSts)
	fmt.Println("count ", count)
	var st2 persistence.SampleTask
	sampleTaskDao.Db.Take(&st2)
	oldName := st2.Name
	st2.Name = oldName + "_test_suffix"
	sampleTaskDao.Upsert(&st2)
	var updatedSt persistence.SampleTask
	sampleTaskDao.Db.First(&updatedSt, st2.ID)
	assert.Equal(suite.T(), updatedSt.Name, st2.Name)
	//Revert back the name
	st2.Name = oldName
	sampleTaskDao.Upsert(&st2)
	sampleTaskDao.Db.Find(&allSts)
	newCount := len(allSts)
	fmt.Println("newCount ", newCount)
	assert.Equal(suite.T(), count, newCount)
}

func (suite *ClientTestSuite) TestClient() {
	assert.True(suite.T(), true, true)
}


func TestClients(t *testing.T) {
	suite.Run(t, new(ClientTestSuite))
}