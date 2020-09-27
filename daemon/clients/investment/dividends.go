package main

import (
	"fmt"
	"time"
	"encoding/json"
	"strconv"

	"github.com/pkg/errors"
	"github.com/go-resty/resty/v2"
)

type DividendsData struct {
	Dividends []Dividends `json:"dividends"`
}

// Serializer for Dividends response
type Dividends struct {
	ID             string `json:"id"`
	Date           string `json:"date"`
	Ticker         string `json:"ticker"`
	Name           string `json:"name"`
	Exchange       string `json:"exchange"`
	Currency       string `json:"currency"`
	Frequency      int    `json:"frequency"`
	Dividend       string `json:"dividend"`
	DividendType   string `json:"dividend_type"`
	DividendYield  string `json:"dividend_yield"`
	ExDividendDate string `json:"ex_dividend_date"`
	PayableDate    string `json:"payable_date"`
	RecordDate     string `json:"record_date"`
	Importance     int    `json:"importance"`
	Updated        int    `json:"updated"`
}

func fetchDivideneds() (*DividendsData, error) {
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

	// Request for Dividends info of current month
	judge := int(month)
	switch judge {
	case 2:
		dateto = datebase + "-28"
	case 4, 6, 9 , 11:
		dateto = datebase + "-30" 
	default:
		dateto = datebase + "-31"
	}

	url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/dividends?tpagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", datefrom, dateto)
	resp, err := client.R().
	Get(url)

	if err != nil {
		return nil, errors.Wrap(err, "sending request failed!")
	}

	var data DividendsData

	if err := json.Unmarshal(resp.Body(), &data); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("Unmarshal earnings response failed: %s", string(resp.Body())))
	}

	for i:= range(data) {
		target := data[i]
		item := persistence.SampleTask{
			CreatedAt: time.Now,
			UpdatedAt: time.Now,
			MetaData: "INVESTMENT_DIVIDENDS_RECORD",
			Content: "",
			Name: target.Name,
			Uid: target.ID,
			AvailableBefore: target.Date,
			ReminderBeforeTask: 0,
			DueDate: "",			
			DueTime: ""
		}
		sampleTaskDao.Upsert(&item)
	}

	return &data, nil
}
