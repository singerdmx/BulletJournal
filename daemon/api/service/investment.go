package service

import (
	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"time"
)

type Investment struct {
	Service  Streaming
}

func (i *Investment) pull(params ...interface{}) {
	logger := *logging.GetLogger()
	logger.Infof("Investment starts at %v", time.Now().In(params[0].(*time.Location)).Format(time.RFC3339))

	ipoClient, _ := investment.NewTemplateClient(investment.IPOTemplate)
	earningClient, _ := investment.NewTemplateClient(investment.EarningsTemplate)
	dividendsClient, _ := investment.NewTemplateClient(investment.DividendsTemplate)

	retrieveData(ipoClient, logger, i.Service)
	retrieveData(earningClient, logger, i.Service)
	retrieveData(dividendsClient, logger, i.Service)
}

func retrieveData(templateClient *investment.TemplateClient, logger logging.Logger, streaming Streaming) {
	error := templateClient.FetchData()
	if error != nil {
		logger.Error(error.Error())
		return
	}
	created, modified, error := templateClient.SendData()
	if error != nil {
		logger.Error(error.Error())
		return
	}

	for _, sampleTaskId := range *created {
		logger.Printf("Created Sample Task %d", sampleTaskId)
		// streaming <- &StreamingMessage{Message: sampleTaskId}
	}
	for _, sampleTaskId := range *modified {
		logger.Printf("Modified Sample Task %d", sampleTaskId)
		// streaming <- &StreamingMessage{Message: sampleTaskId}
	}
}
