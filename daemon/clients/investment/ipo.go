package main

import (
	"fmt"
	"time"
	"encoding/json"
	"strconv"

	"github.com/pkg/errors"
	"github.com/go-resty/resty"
)

type IPOData struct {
	IPO []IPO `json:"ipos"`
}

// Serializer for IPO response
type IPO struct {
	ID                             string        `json:"id"`
	Date                           string        `json:"date"`
	Time                           string        `json:"time"`
	Ticker                         string        `json:"ticker"`
	Exchange                       string        `json:"exchange"`
	Name                           string        `json:"name"`
	OpenDateVerified               bool          `json:"open_date_verified"`
	PricingDate                    string        `json:"pricing_date"`
	Currency                       string        `json:"currency"`
	PriceMin                       string        `json:"price_min"`
	PriceMax                       string        `json:"price_max"`
	DealStatus                     string        `json:"deal_status"`
	InsiderLockupDate              string        `json:"insider_lockup_date"`
	OfferingValue                  int           `json:"offering_value"`
	OfferingShares                 int           `json:"offering_shares"`
	SharesOutstanding              int           `json:"shares_outstanding"`
	UnderwriterQuietExpirationDate string        `json:"underwriter_quiet_expiration_date"`
	Notes                          string        `json:"notes"`
	Updated                        int           `json:"updated"`
}

func fetchIPO() (*IPOData, error) {
	client := resty.New()
	year, month, _:= time.Now().Date()

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
	case 4, 6, 9 , 11:
		dateto = datebase + "-30" 
	default:
		dateto = datebase + "-31"
	}

	url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/ipos?tpagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", datefrom, dateto)
	resp, err := client.R().
	Get(url)

	if err != nil {
		return nil, errors.Wrap(err, "sending request failed!")
	}

	var data IPOData

	if err := json.Unmarshal(resp.Body(), &data); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("Unmarshal earnings response failed: %s", string(resp.Body())))
	}

	return &data, nil
}
