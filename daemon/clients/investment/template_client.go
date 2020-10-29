package investment

import (
	"context"
	"fmt"

	"github.com/go-resty/resty/v2"
	"github.com/pkg/errors"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

var log logging.Logger

type (
	AbstractTemplateClientInterface interface {
		FetchData() error
		SendData() (*[]uint64, *[]uint64, error)
	}

	TemplateClient struct {
		AbstractTemplateClientInterface
	}
)

const (
	EarningsTemplate  = "Earnings"
	DividendsTemplate = "Dividends"
	IPOTemplate       = "IPO"
)

func NewTemplateClient(TemplateName string, ctx context.Context, sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) (*TemplateClient, error) {
	var f func(ctx context.Context, sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) (*TemplateClient, error)
	switch TemplateName {
	case EarningsTemplate:
		f = NewEarningsClient
	case DividendsTemplate:
		f = NewDividendsClient
	case IPOTemplate:
		f = NewIPOClient
	default:
		return nil, errors.Wrap(errors.New("Template not implemented"),
			fmt.Sprintf("Template %s not implement", TemplateName))
	}
	TemplateClientInstance, err := f(ctx, sampleTaskDao, restClient)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("cannot create template for %s", TemplateName))
	}
	return TemplateClientInstance, nil
}
