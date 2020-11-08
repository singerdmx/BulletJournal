package service

import (
	"context"
	"time"

	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/consts"
	"github.com/singerdmx/BulletJournal/daemon/persistence"

	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type Investment struct {
	StreamChannel   chan<- *StreamingMessage
	ipoClient       *investment.IPOClient
	earningClient   *investment.EarningClient
	dividendsClient *investment.DividendsClient
}

func NewInvestment(streamChannel chan<- *StreamingMessage, ctx context.Context, sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) *Investment {
	ipoClient := investment.NewIPOClient(sampleTaskDao, restClient)
	earningClient := investment.NewEarningsClient(sampleTaskDao, restClient)
	dividendsClient := investment.NewDividendsClient(sampleTaskDao, restClient)

	return &Investment{StreamChannel: streamChannel, ipoClient: ipoClient, earningClient: earningClient, dividendsClient: dividendsClient}
}

type void struct{}

var member void

func (i *Investment) pull(params ...interface{}) {
	logger := *logging.GetLogger()
	logger.Infof("Investment starts at %v", time.Now().In(params[0].(*time.Location)).Format(time.RFC3339))

	i.retrieveData(i.ipoClient)
	i.retrieveData(i.earningClient)
	i.retrieveData(i.dividendsClient)
}

func (i *Investment) retrieveData(templateClient investment.Extractor) {
	logger := *logging.GetLogger()

	created, modified, error := templateClient.ProcessData()
	if error != nil {
		logger.Error(error.Error())
		return
	}

	set := make(map[uint64]void)
	for _, sampleTaskId := range *created {
		if _, exists := set[sampleTaskId]; exists {
			continue
		}
		logger.Printf("Created Sample Task %d", sampleTaskId)
		set[sampleTaskId] = member
		time.Sleep(30 * time.Second)
		i.StreamChannel <- &StreamingMessage{Message: sampleTaskId, ServiceName: consts.INVESTMENT_SERVICE_NAME}
	}
	for _, sampleTaskId := range *modified {
		if _, exists := set[sampleTaskId]; exists {
			continue
		}
		logger.Printf("Modified Sample Task %d", sampleTaskId)
		set[sampleTaskId] = member
		time.Sleep(30 * time.Second)
		i.StreamChannel <- &StreamingMessage{Message: sampleTaskId, ServiceName: consts.INVESTMENT_SERVICE_NAME}
	}
}
