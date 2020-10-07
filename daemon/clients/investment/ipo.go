package investment

import (
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"strconv"
	"time"

	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

type IPOClient struct {
	BaseTemplateClient
	data *IPOData
}

type IPOData struct {
	IPO []IPO `json:"ipos"`
}

// Serializer for IPO response
type IPO struct {
	ID                             string `json:"id"`
	Date                           string `json:"date"`
	Time                           string `json:"time"`
	Ticker                         string `json:"ticker"`
	Exchange                       string `json:"exchange"`
	Name                           string `json:"name"`
	OpenDateVerified               bool   `json:"open_date_verified"`
	PricingDate                    string `json:"pricing_date"`
	Currency                       string `json:"currency"`
	PriceMin                       string `json:"price_min"`
	PriceMax                       string `json:"price_max"`
	DealStatus                     string `json:"deal_status"`
	InsiderLockupDate              string `json:"insider_lockup_date"`
	OfferingValue                  int    `json:"offering_value"`
	OfferingShares                 int    `json:"offering_shares"`
	SharesOutstanding              int    `json:"shares_outstanding"`
	UnderwriterQuietExpirationDate string `json:"underwriter_quiet_expiration_date"`
	Notes                          string `json:"notes"`
	Updated                        int    `json:"updated"`
}

const layoutISO = "2006-01-02"

func NewIPOClient() (*TemplateClient, error) {
	c := IPOClient{
		BaseTemplateClient: NewBaseTemplateClient(),
	}
	return &TemplateClient{&c}, nil
}

func (c *IPOClient) FetchData() error {
	fmt.Println("fetching IPO")
	year, month, _ := time.Now().Date()

	var datefrom string
	var dateto string
	var datebase string

	if int(month) < 10 {
		datebase = strconv.Itoa(year) + "-0" + strconv.Itoa(int(month))
	} else {
		datebase = strconv.Itoa(year) + "-" + strconv.Itoa(int(month))
	}

	datefrom = datebase + "-01"

	// Request for IPO info of current month
	judge := int(month)
	switch judge {
	case 2:
		dateto = datebase + "-28"
	case 4, 6, 9, 11:
		dateto = datebase + "-30"
	default:
		dateto = datebase + "-31"
	}

	url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/ipos?tpagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", datefrom, dateto)
	resp, err := c.restClient.R().
		Get(url)

	if err != nil {
		return errors.Wrap(err, "IPO client sending request failed!")
	}

	var data IPOData

	if err := json.Unmarshal(resp.Body(), &data); err != nil {
		return errors.Wrap(err, fmt.Sprintf("Unmarshal earnings response failed: %s", string(resp.Body())))
	}
	c.data = &data
	return nil
}

func (c *IPOClient) SendData() error {
	if c.data == nil {
		return errors.New("Empty IPO data, please fetch data first.")
	}
	for i := range c.data.IPO {
		target := c.data.IPO[i]
		availBefore := target.Date
		t, _ := time.Parse(layoutISO, availBefore)
		item := persistence.SampleTask{
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
			Metadata:        "INVESTMENT_IPO_RECORD",
			Content:         "",
			Name:            fmt.Sprintf("%v (%v) goes public on %v", target.Name, target.Ticker, t),
			Uid:             target.ID,
			AvailableBefore: t,
			DueDate:         target.PricingDate,
			DueTime:         "",
			Pending:         true,
			Refreshable:     true,
		}
		fmt.Println(item.AvailableBefore)
		c.sampleDao.Upsert(&item)
	}

	return nil
}
