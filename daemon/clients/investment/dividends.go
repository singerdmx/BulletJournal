package investment

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/pkg/errors"

	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

type DividendsClient struct {
	BaseTemplateClient
	data *DividendsData
}

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

func NewDividendsClient() (*TemplateClient, error) {
	c := DividendsClient{
		BaseTemplateClient: NewBaseTemplateClient(),
	}
	return &TemplateClient{&c}, nil
}

func (c *DividendsClient) FetchData() error {
	yearFrom, monthFrom, dayFrom := time.Now().Date()
	yearTo, monthTo, dayTo := time.Now().AddDate(0, 1, 0).Date()

	var dateFrom string
	var dateTo string

	if int(monthFrom) < 10 {
		dateFrom = strconv.Itoa(yearFrom) + "-0" + strconv.Itoa(int(monthFrom))
		if int(dayFrom) < 10 {
			dateFrom = dateFrom + "-0" + strconv.Itoa(dayFrom)
		} else {
			dateFrom = dateFrom + strconv.Itoa(dayFrom)
		}
	} else {
		dateFrom = strconv.Itoa(yearFrom) + "-" + strconv.Itoa(int(monthFrom))
		if int(dayFrom) < 10 {
			dateFrom = dateFrom + "-0" + strconv.Itoa(dayFrom)
		} else {
			dateFrom = dateFrom + "-" + strconv.Itoa(dayFrom)
		}
	}

	if int(monthTo) < 10 {
		dateTo = strconv.Itoa(yearTo) + "-0" + strconv.Itoa(int(monthTo))
		if int(dayTo) < 10 {
			dateTo = dateTo + "-0" + strconv.Itoa(dayTo)
		} else {
			dateTo = dateTo + strconv.Itoa(dayTo)
		}
	} else {
		dateTo = strconv.Itoa(yearTo) + "-" + strconv.Itoa(int(monthTo))
		if int(dayTo) < 10 {
			dateTo = dateTo + "-0" + strconv.Itoa(dayTo)
		} else {
			dateTo = dateTo + "-" + strconv.Itoa(dayTo)
		}
	}

	url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/dividends?tpagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", dateFrom, dateTo)
	resp, err := c.restClient.R().
		Get(url)

	if err != nil {
		return errors.Wrap(err, "Dividends client sending request failed!")
	}

	var data DividendsData

	if err := json.Unmarshal(resp.Body(), &data); err != nil {
		return errors.Wrap(err, fmt.Sprintf("Unmarshal earnings response failed: %s", string(resp.Body())))
	}
	c.data = &data
	return nil
}
func (c *DividendsClient) SendData() (*[]uint64, *[]uint64, error) {
	if c.data == nil {
		return nil, nil, errors.New("Empty Dividends data, please fetch data first.")
	}
	created := make([]uint64, 0)
	modified := make([]uint64, 0)
	for i := range c.data.Dividends {
		target := c.data.Dividends[i]
		availBefore := target.Date
		t, _ := time.Parse(layoutISO, availBefore)
		item := persistence.SampleTask{
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
			Metadata:        "INVESTMENT_DIVIDENDS_RECORD",
			Content:         "",
			Name:            target.Name,
			Uid:             "INVESTMENT_DIVIDENDS_RECORD_" + target.Ticker,
			AvailableBefore: t,
			DueDate:         "",
			DueTime:         "",
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
