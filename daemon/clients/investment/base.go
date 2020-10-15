package investment

import (
	"strconv"
	"time"

	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

type BaseTemplateClient struct {
	sampleDao  *persistence.SampleTaskDao
	restClient *resty.Client
}

func NewBaseTemplateClient() BaseTemplateClient {
	dao, err := persistence.NewSampleTaskDao()
	if err != nil {
		log.Fatal("DAO for Template init failed: ", err)
		return BaseTemplateClient{}
	}
	return BaseTemplateClient{
		sampleDao:  dao,
		restClient: resty.New(),
	}
}

func dateFormatter(year int, month time.Month, day int) (date string) {
	var dateRes string

	if int(month) < 10 {
		dateRes = strconv.Itoa(year) + "-0" + strconv.Itoa(int(month))
	} else {
		dateRes = strconv.Itoa(year) + "-" + strconv.Itoa(int(month))
	}

	if int(day) < 10 {
		dateRes = dateRes + "-0" + strconv.Itoa(day)
	} else {
		dateRes = dateRes + "-" + strconv.Itoa(day)
	}

	return dateRes
}
