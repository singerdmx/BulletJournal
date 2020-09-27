package main

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/singerdmx/BulletJournal/daemon/clients"
)

var ctx = context.Background()

type ClientTestSuite struct {
	suite.Suite
}

// Fetched ipo is not nil
func testIPOClientFetchInfo(t *testing.T) {
	data := clients.investment.ipo.fetchIPO()
	assert.NotNil(t, data)
}

// Fetched dividend is not nil
func testDividendFetchInfo(t *testing.T) {
	data := clients.investment.dividends.fetchDividends()
	assert.NotNil(t, data)
}
