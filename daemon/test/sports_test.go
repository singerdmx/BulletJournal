package main

import (
	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/clients/sports"
	"github.com/stretchr/testify/suite"
	"testing"
)

type SportsTestSuite struct {
	suite.Suite
}

func (suite *SportsTestSuite) TestFetchNbaScheduleData() {
	restClient := resty.New()
	nc := sports.GetNbaClient(restClient)
	//nc.FetchNbaScheduleData(sports.NbaScheduleEndpoint)
	nc.FetchAndStoreNbaScheduleData()
}

// In order for 'go test' to run this suite, we need to create
// a normal test function and pass our suite to suite.Run
func TestSportsTestSuite(t *testing.T) {
	suite.Run(t, new(SportsTestSuite))
}