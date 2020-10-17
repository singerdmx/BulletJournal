package investment

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/singerdmx/BulletJournal/daemon/logging"
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
	EarningsTemplate = "Earnings"
	DividendsTemplate = "Dividends"
	IPOTemplate = "IPO"
)

func NewTemplateClient(TemplateName string) (*TemplateClient, error) {
	var f func() (*TemplateClient, error)
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
	TemplateClientInstance, err := f()
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("cannot create template for %s", TemplateName))
	}
	return TemplateClientInstance, nil
}

