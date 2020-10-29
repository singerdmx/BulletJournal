package investment

import (
	"context"
	"strconv"
	"time"

	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

type BaseTemplateClient struct {
	ctx        context.Context
	sampleDao  *persistence.SampleTaskDao
	restClient *resty.Client
}

func NewBaseTemplateClient(ctx context.Context, sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) BaseTemplateClient {
	return BaseTemplateClient{
		ctx:        ctx,
		sampleDao:  sampleTaskDao,
		restClient: restClient,
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
