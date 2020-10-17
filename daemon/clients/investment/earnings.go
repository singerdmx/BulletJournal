package investment

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/pkg/errors"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
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
	yearFrom, monthFrom, dayFrom := time.Now().AddDate(0, -1, 0).Date()
	yearTo, monthTo, dayTo := time.Now().AddDate(0, 1, 0).Date()

	dateFrom := dateFormatter(yearFrom, monthFrom, dayFrom)
	dateTo := dateFormatter(yearTo, monthTo, dayTo)

	url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/earnings?pagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", dateFrom, dateTo)
	resp, err := c.restClient.R().Get(url)
	if err != nil {
		return errors.Wrap(err, "sending request failed")
	}
	data := Earnings{}
	if err := json.Unmarshal(resp.Body(), &data); err != nil {
		return errors.Wrap(err, fmt.Sprintf("%s Unmarshal earnings response failed: %s", url, string(resp.Body())))
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
		availBefore :=  target.Date
		t, _ := time.Parse(layoutISO, availBefore)
		t = t.AddDate(0, 6, 0)
		dueDate := target.Date
		if len(dueDate) > 10 {
			dueDate = dueDate[0:10] // yyyy-MM-dd
		}
		dueTime := target.Time
		if len(dueTime) > 5 {
			dueTime = dueTime[0:5]
		}
		raw, _ := json.Marshal(target)
		item := persistence.SampleTask{
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
			Metadata:        "INVESTMENT_EARNINGS_RECORD",
			Raw:             string(raw),
			Name:            fmt.Sprintf("%v (%v) reports earnings on %v", target.Name, target.Ticker, dueDate),
			Uid:             "INVESTMENT_EARNINGS_RECORD_" + target.Ticker,
			AvailableBefore: t,
			DueDate:         dueDate,
			DueTime:         dueTime,
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
