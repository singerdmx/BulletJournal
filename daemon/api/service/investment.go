package service

import (
	"time"

	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type Investment struct {
	ServiceStreaming Streaming
}

func (i *Investment) pull(params ...interface{}) {
	logger := *logging.GetLogger()
	logger.Infof("Investment starts at %v", time.Now().In(params[0].(*time.Location)).Format(time.RFC3339))

	ipoClient, _ := investment.NewTemplateClient(investment.IPOTemplate)
	earningClient, _ := investment.NewTemplateClient(investment.EarningsTemplate)
	dividendsClient, _ := investment.NewTemplateClient(investment.DividendsTemplate)

	retrieveData(ipoClient, i.ServiceStreaming)
	retrieveData(earningClient, i.ServiceStreaming)
	retrieveData(dividendsClient, i.ServiceStreaming)
}

func retrieveData(templateClient *investment.TemplateClient, streaming Streaming) {
	logger := *logging.GetLogger()
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
		streaming.ServiceChannel <- &StreamingMessage{Message: uint(sampleTaskId)}
	}
	for _, sampleTaskId := range *modified {
		logger.Printf("Modified Sample Task %d", sampleTaskId)
		streaming.ServiceChannel <- &StreamingMessage{Message: uint(sampleTaskId)}
	}
}
