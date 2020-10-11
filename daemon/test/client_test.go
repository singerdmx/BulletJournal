package main

import (
	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
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

func (suite *ClientTestSuite) TestClient() {
	assert.True(suite.T(), true, true)
}


func TestClients(t *testing.T) {
	suite.Run(t, new(ClientTestSuite))
}