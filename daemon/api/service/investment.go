package service

import (
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/daemon/clients/investment"
	"time"
)


type Investment struct {
}

func (i *Investment) pull(params ...interface{}) {
	logger := *logging.GetLogger()
	logger.Infof("Investment starts at %v", time.Now().In(params[0].(*time.Location)).Format(time.RFC3339))

	ipoClient,_ := investment.NewTemplateClient(investment.IPOTemplate)
	earningClient,_ := investment.NewTemplateClient(investment.EarningsTemplate)
	dividendsClient,_ := investment.NewTemplateClient(investment.DividendsTemplate)

	//TODO: upsert is not working since gorm won't create instance, daemon will be stucked

	// ipoClient.FetchData()
	// ipoClient.SendData()

	// earningClient.FetchData()
	// earningClient.SendData()

	// dividendsClient.FetchData()
	// dividendsClient.SendData()
}
