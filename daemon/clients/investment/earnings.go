package investment

import (
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"regexp"
)

type EarningClient struct {
	requester *Requester
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

func NewEarningsClient() (*EarningClient, error) {
	c := EarningClient{
		NewRequester(earningsClientName),
	}
	return &c, nil
}

func (c *EarningClient) fetchEarnings(date string) (em *Earnings, err error) {
	baseURL := "https://www.benzinga.com/services/webapps/calendar/earnings"
	timeRegex := regexp.MustCompile(`\d{4}-\d{2}-\d{2}`)
	match := timeRegex.FindStringSubmatch(date)
	if len(match) == 0 {
		return nil, errors.New(fmt.Sprintf("invalid date for earnings parameter %+v", date))
	}

	url := fmt.Sprintf("%s?tpagesize=%+v&parameters[date]=%d&parameters[importance]+%d", baseURL, earningsDefaultPageSize, date, earningsDefaultImportance)
	resp, err := c.requester.RequestREST("GET", url, nil, nil)
	if err != nil {
		return nil, errors.Wrap(err, "sending request failed")
	}
	if resp.StatusCode != 200 {
		log.Error("Earnings request Status Code: %+v", resp.StatusCode)
		return nil, errors.Wrap(err, fmt.Sprintf("Invalid response status code: %+v", resp.StatusCode))
	}
	content := resp.Body
	earnings := Earnings{}
	if err := json.Unmarshal(content, &earnings); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("Unmarshal earnings response failed: %s", string(resp.Body)))
	}
	return &earnings, nil
}