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

type EarningClient struct {
	InvestmentClient
	data *EarningsData
}

type EarningsData struct {
	Earning []Earning `json:"earnings"`
}

type Earning struct {
	ID                     string `json:"id"`
	Date                   string `json:"date"`
	DateConfirmed          int16  `json:"date_confirmed"`
	Time                   string `json:"time"`
	Ticker                 string `json:"ticker"`
	Exchange               string `json:"exchange"`
	Name                   string `json:"name"`
	Period                 string `json:"period"`
	PeriodYear             int16  `json:"period_year"`
	Currency               string `json:"currency"`
	EPS                    string `json:"eps"`
	EPSEst                 string `json:"eps_est"`
	EPSPrior               string `json:"eps_prior"`
	EPSSuprise             string `json:"eps_surprise"`
	EPSSuprisePercent      string `json:"eps_surprise_percent"`
	EPSTYPE                string `json:"eps_type"`
	Revenue                string `json:"revenue"`
	RevenueEst             string `json:"revenue_est"`
	RevenuePrior           string `json:"revenue_prior"`
	RevenueSurprise        string `json:"revenue_surprise"`
	RevenueSurprisePercent string `json:"revenue_surprise_percent"`
	RevenueType            string `json:"revenue_type"`
	Importance             int16  `json:"importance"`
	Notes                  string `json:"notes"`
	Updated                int64  `json:"updated"`
}

const (
	earningsDefaultPageSize   = 500
	earningsDefaultImportance = 0
	RFC3339                   = "2006-01-02T15:04:05Z07:00"
)

func NewEarningsClient(sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) *EarningClient {
	return &EarningClient{
		InvestmentClient: Init("earnings", sampleTaskDao, restClient),
	}
}

func (c *EarningClient) ProcessData() (*[]uint64, *[]uint64, error) {
	return c.ProcessAllData(-6, c)
}

func (c *EarningClient) toSampleTasks(response [][]byte) ([]persistence.SampleTask, error) {

	logger := *logging.GetLogger()
	set := make(map[string]void)
	var fetchedData []Earning
	for _, resp := range response {
		data := EarningsData{}
		if resp == nil || len(resp) == 0 {
			continue
		}
		if err := json.Unmarshal(resp, &data); err != nil {
			//logger.Error(fmt.Sprintf("%s Unmarshal earnings response failed: %s", url, string(resp.Body())))
			logger.Errorf("Unmarshal earnings response failed: %v", resp)
			continue
		}
		fetchedData = append(fetchedData, data.Earning...)
	}
	temp := EarningsData{Earning: fetchedData}
	c.data = &temp

	if c.data == nil {
		return nil, errors.New("Empty EarningsData data, please fetch data first.")
	}

	var sampleTasks []persistence.SampleTask
	for i := range c.data.Earning {
		item := c.toSampleTask(c.data.Earning[i])
		if _, exists := set[item.Uid]; exists {
			continue
		}
		set[item.Uid] = val
		sampleTasks = append(sampleTasks, item)
	}
	return sampleTasks, nil
}

func (c *EarningClient) toSampleTask(data Earning) persistence.SampleTask { // data EarningsData
	// for converting one sample task

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
		Metadata:        "INVESTMENT_EARNINGS_RECORD",
		Raw:             string(raw),
		Name:            fmt.Sprintf("%v (%v) reports earnings on %v", data.Name, data.Ticker, dueDate),
		Uid:             "INVESTMENT_EARNINGS_RECORD_" + data.Ticker,
		AvailableBefore: t,
		DueDate:         dueDate,
		DueTime:         dueTime,
		Pending:         true,
		Refreshable:     true,
		TimeZone:        "America/New_York",
	}
	return item

}
