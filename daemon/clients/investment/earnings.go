package investment

import (
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"regexp"
	"time"
)

type EarningClient struct {
	BaseTemplateClient
}

type Earnings struct {
	EarningData []EarningData `json:"earnings"`
}

type EarningData struct {
	ID                      string `json:"id"`
	Date                    string `json:"date"`
	DateConfirmed            int16  `json:"date_confirmed"`
	Time                    string `json:"time"`
	Ticker                  string `json:"ticker"`
	Exchange                string `json:"exchange"`
	Name                    string `json:"name"`
	Period                  string `json:"period"`
	PeriodYear              int16  `json:"period_year"`
	Currency                string `json:"currency"`
	EPS                     string `json:"eps"`
	EPSEst                  string `json:"eps_est"`
	EPSPrior                string `json:"eps_prior"`
	EPSSuprise              string `json:"eps_surprise"`
	EPSSuprisePercent       string `json:"eps_surprise_percent"`
	EPSTYPE                 string `json:"eps_type"`
	Revenue                 string `json:"revenue"`
	RevenueEst              string `json:"revenue_est"`
	RevenuePrior            string `json:"revenue_prior"`
	RevenueSurprise         string `json:"revenue_surprise"`
	RevenueSurprisePercent  string `json:"revenue_surprise_percent"`
	RevenueType             string `json:"revenue_type"`
	Importance              int16  `json:"importance"`
	Notes                   string `json:"notes"`
	Updated                 int64  `json:"updated"`
}

const (
	earningsClientName = "earnings"
	earningsDefaultPageSize = 500
	earningsDefaultImportance = 0
)

func NewEarningsClient() (*TemplateClient, error) {
	c := EarningClient{
		BaseTemplateClient: NewBaseTemplateClient(),
	}
	return &TemplateClient{&c}, nil
}

func (c *EarningClient) FetchData(date string) error {
	baseURL := "https://www.benzinga.com/services/webapps/calendar/earnings"
	timeRegex := regexp.MustCompile(`\d{4}-\d{2}-\d{2}`)
	match := timeRegex.FindStringSubmatch(date)
	if len(match) == 0 {
		return errors.New(fmt.Sprintf("invalid date for earnings parameter %+v", date))
	}

	url := fmt.Sprintf("%s?tpagesize=%+v&parameters[date]=%d&parameters[importance]+%d", baseURL, earningsDefaultPageSize, date, earningsDefaultImportance)
	resp, err := c.restClient.R().Get(url)
	if err != nil {
		return errors.Wrap(err, "sending request failed")
	}
	data := Earnings{}
	if err := json.Unmarshal(resp.Body(), &data); err != nil {
		return errors.Wrap(err, fmt.Sprintf("Unmarshal earnings response failed: %s", string(resp.Body())))
	}

	for i := range data.EarningData {
		target := data.EarningData[i]
		item := persistence.SampleTask{
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			MetaData: "INVESTMENT_EARNINGS_RECORD",
			Content: "",
			Name: target.Name,
			Uid: target.ID,
			AvailableBefore: target.Date,
			ReminderBeforeTask: 0,
			DueDate: target.Date,
			DueTime: target.Time,
			Pending: true,
		}
		ps.sampleTaskDao.Upsert(&item)
	}
	return nil
}
func (c *EarningClient)SendData() error {
	return nil
}