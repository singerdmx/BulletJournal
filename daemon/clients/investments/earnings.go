package main

import (
	"encoding/json"
	"fmt"
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
	earningClientName = "Earnings"
)

func NewEarningsClient() (*EarningClient, error) {
	c := EarningClient{
		NewRequester(earningClientName),
	}
	return &c, nil
}

//TODO: Passin parameters instead of raw url
func (c *EarningClient) fetchEarnings() (em *Earnings, err error) {
	url := "https://www.benzinga.com/services/webapps/calendar/earnings?tpagesize=500&parameters[date]=2020-09-22&parameters[date_from]=&parameters[date_to]=&parameters[importance]=0"
	resp, err := c.requester.RequestREST("GET", url, nil, nil)
	content := resp.Body
	earnings := Earnings{}
	if err := json.Unmarshal(content, &earnings); err != nil {
		// unknown
		return nil, err
	}
	fmt.Println(earnings)
	return &earnings, nil
}