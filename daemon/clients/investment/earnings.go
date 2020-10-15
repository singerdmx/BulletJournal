package investment

import (
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"time"
)

type EarningClient struct {
	BaseTemplateClient
	data *Earnings
}

type Earnings struct {
	EarningData []EarningData `json:"earnings"`
}

type EarningData struct {
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

func NewEarningsClient() (*TemplateClient, error) {
	c := EarningClient{
		BaseTemplateClient: NewBaseTemplateClient(),
	}
	return &TemplateClient{&c}, nil
}

func (c *EarningClient) FetchData() error {
	t := time.Now().Local()
	date := t.Format("2006-01-02")
	baseURL := "https://www.benzinga.com/services/webapps/calendar/earnings"

	url := fmt.Sprintf("%s?pagesize=%+v&parameters[date]=%s&parameters[importance]=%d", baseURL, earningsDefaultPageSize, date, earningsDefaultImportance)
	resp, err := c.restClient.R().Get(url)
	if err != nil {
		return errors.Wrap(err, "sending request failed")
	}
	data := Earnings{}
	if err := json.Unmarshal(resp.Body(), &data); err != nil {
		return errors.Wrap(err, fmt.Sprintf("Unmarshal earnings response failed: %s", string(resp.Body())))
	}
	c.data = &data
	return nil
}

func (c *EarningClient) SendData() (*[]uint64, *[]uint64, error) {
	if c.data == nil {
		return nil, nil, errors.New("Empty Earnings data, please fetch data first.")
	}
	created := make([]uint64, 0)
	modified := make([]uint64, 0)
	for i := range c.data.EarningData {
		target := c.data.EarningData[i]
		availBefore := target.Date + "T" + target.Time + "Z00:00"
		t, _ := time.Parse(RFC3339, availBefore)
		item := persistence.SampleTask{
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
			Metadata:        "INVESTMENT_EARNINGS_RECORD",
			Content:         "",
			Name:            target.Name,
			Uid:             "INVESTMENT_EARNINGS_RECORD_" + target.Ticker,
			AvailableBefore: t,
			DueDate:         target.Date,
			DueTime:         target.Time,
			Pending:         true,
			Refreshable:     true,
			TimeZone:        "America/New_York",
		}
		if entityId, newRecord := c.sampleDao.Upsert(&item); newRecord && entityId > 0 {
			created = append(created, entityId)
		} else if !newRecord && entityId > 0 {
			modified = append(modified, entityId)
		}
	}
	return &created, &modified, nil
}
