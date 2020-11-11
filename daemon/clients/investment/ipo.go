package investment

import (
	"encoding/json"
	"fmt"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"time"

	"github.com/go-resty/resty/v2"
	"github.com/pkg/errors"

	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

type IPOClient struct {
	InvestmentClient
	data *IPOData
}

type IPOData struct {
	IPO []IPO `json:"ipos"`
}

// Serializer for IPO response
type IPO struct {
	ID                             string   `json:"id"`
	Date                           string   `json:"date"`
	Time                           string   `json:"time"`
	Ticker                         string   `json:"ticker"`
	Exchange                       string   `json:"exchange"`
	Name                           string   `json:"name"`
	OpenDateVerified               bool     `json:"open_date_verified"`
	PricingDate                    string   `json:"pricing_date"`
	Currency                       string   `json:"currency"`
	PriceMin                       string   `json:"price_min"`
	PriceMax                       string   `json:"price_max"`
	DealStatus                     string   `json:"deal_status"`
	InsiderLockupDays              int      `json:"insider_lockup_days"`
	InsiderLockupDate              string   `json:"insider_lockup_date"`
	OfferingValue                  int      `json:"offering_value"`
	OfferingShares                 int      `json:"offering_shares"`
	SharesOutstanding              int      `json:"shares_outstanding"`
	LeadUnderwriters               []string `json:"lead_underwriters"`
	UnderwriterQuietExpirationDate string   `json:"underwriter_quiet_expiration_date"`
	Notes                          string   `json:"notes"`
	Updated                        int      `json:"updated"`
}

const layoutISO = "2006-01-02"

func NewIPOClient(sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) *IPOClient {
	return &IPOClient{
		InvestmentClient: Init("ipos", sampleTaskDao, restClient),
	}
}

func (c *IPOClient) ProcessData() (*[]uint64, *[]uint64, error) {
	return c.ProcessAllData(-6, c)
}


func (c *IPOClient) toSampleTasks(response [][]byte) ([]persistence.SampleTask, error) {
	logger := *logging.GetLogger()
	set := make(map[string]void)
	var fetchedData []IPO
	for _, resp := range response {
		data := IPOData{}
		if resp == nil || len(resp) == 0 {
			continue
		}
		if err := json.Unmarshal(resp, &data); err != nil {
			//logger.Error(fmt.Sprintf("%s Unmarshal ipos response failed: %s", url, string(resp.Body())))
			logger.Errorf("Unmarshal ipos response failed: %v", resp)
			continue
		}
		fetchedData = append(fetchedData, data.IPO...)
	}
	temp := IPOData{IPO: fetchedData}
	c.data = &temp

	if c.data == nil {
		return nil, errors.New("Empty IPO data, please fetch data first.")
	}

	var sampleTasks []persistence.SampleTask
	for i := range c.data.IPO {
		item := c.toSampleTask(c.data.IPO[i])
		if _, exists := set[item.Uid]; exists {
			continue
		}
		set[item.Uid] = val
		sampleTasks = append(sampleTasks, item)
	}
	return sampleTasks, nil
}

func (c *IPOClient) toSampleTask(data IPO) persistence.SampleTask { // data IPOData
	availBefore := data.Date
	t, _ := time.Parse(layoutISO, availBefore)
	t = t.AddDate(0, 0, expireInDays)
	dueDate := data.Date
	if len(dueDate) > 10 {
		dueDate = dueDate[0:10] // yyyy-MM-dd
	}
	dueTime := data.Time
	if len(dueTime) > 5 {
		dueTime = dueTime[0:5]
	}
	raw, _ := json.Marshal(data)
	item := persistence.SampleTask{
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
		Metadata:        "INVESTMENT_IPO_RECORD",
		Raw:             string(raw),
		Name:            fmt.Sprintf("%v (%v) goes public on %v", data.Name, data.Ticker, dueDate),
		Uid:             "INVESTMENT_IPO_RECORD_" + data.Ticker,
		AvailableBefore: t,
		DueDate:         dueDate,
		DueTime:         dueTime,
		Pending:         true,
		Refreshable:     true,
		TimeZone:        "America/New_York",
	}
	return item

}
