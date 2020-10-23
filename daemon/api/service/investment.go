package service

import (
	"github.com/singerdmx/BulletJournal/daemon/consts"
	"time"

	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type Investment struct {
	StreamChannel chan<- *StreamingMessage
}

type void struct{}
var member void

func (i *Investment) pull(params ...interface{}) {
	logger := *logging.GetLogger()
	logger.Infof("Investment starts at %v", time.Now().In(params[0].(*time.Location)).Format(time.RFC3339))

	ipoClient, _ := investment.NewTemplateClient(investment.IPOTemplate)
	earningClient, _ := investment.NewTemplateClient(investment.EarningsTemplate)
	dividendsClient, _ := investment.NewTemplateClient(investment.DividendsTemplate)

	i.retrieveData(ipoClient)
	i.retrieveData(earningClient)
	i.retrieveData(dividendsClient)
}

func (i *Investment)retrieveData(templateClient *investment.TemplateClient) {
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
