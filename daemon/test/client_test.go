package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
)

type ClientTestSuite struct {
	suite.Suite
}

// Fetched ipo is not nil
func TestIPOClientFetchInfo(t *testing.T) {
	data, err := investment.FetchIPO()
	assert.Nil(t, err)
	assert.NotNil(t, data)
}

// Fetched dividend is not nil
func TestDividendFetchInfo(t *testing.T) {
	data, err := investment.FetchDividends()
	assert.Nil(t, err)
	assert.NotNil(t, data)
}

func (c *ClientTestSuite) TestClients() {
}