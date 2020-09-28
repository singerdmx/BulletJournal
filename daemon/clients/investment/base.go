package investment

import (
	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

type BaseTemplateClient struct {
	sampleDao  *persistence.SampleTaskDao
	restClient *resty.Client
}

func NewBaseTemplateClient() BaseTemplateClient {
	return BaseTemplateClient{
		sampleDao: persistence.GetSampleTaskDao(),
		restClient: resty.New(),
	}
}