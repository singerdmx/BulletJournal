package investment

import

(
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
		sampleDao: dao,
		restClient: resty.New(),
	}
}