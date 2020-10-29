package investment

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/logging"

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

func NewDividendsClient(ctx context.Context, sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) (*TemplateClient, error) {
	c := DividendsClient{
		BaseTemplateClient: NewBaseTemplateClient(ctx, sampleTaskDao, restClient),
	}
	return &TemplateClient{&c}, nil
}

func (c *DividendsClient) FetchData() error {
	logger := *logging.GetLogger()
	yearFrom, monthFrom, dayFrom := time.Now().AddDate(0, 0, -16).Date()
	yearTo, monthTo, dayTo := time.Now().AddDate(0, 1, 0).Date()

	var fetchedData []Dividends

	startDate := Date(yearFrom, int(monthFrom), dayFrom)
	endDate := Date(yearTo, int(monthTo), dayTo)

	interval := intervalInDays(startDate, endDate)

	for day := dayFrom; day < interval; day += 2 {
		//start a new date base each loop since month can change
		slotStart := Date(yearFrom, int(monthFrom), dayFrom)
		slotendYear, slotendMonth, slotendDay := slotStart.AddDate(0, 0, 2).Date()

		dateFrom := dateFormatter(yearFrom, monthFrom, dayFrom)
		dateTo := dateFormatter(slotendYear, slotendMonth, slotendDay)

		url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/dividends?pagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", dateFrom, dateTo)
		resp, err := c.restClient.R().Get(url)
		if err != nil {
			logger.Error("sending request failed")
			continue
		}
		data := DividendsData{}
		if err := json.Unmarshal(resp.Body(), &data); err != nil {
			logger.Error(fmt.Sprintf("%s Unmarshal dividends response failed: %s", url, string(resp.Body())))
			continue
		}

		fetchedData = append(fetchedData, data.Dividends...)

		yearFrom = slotendYear
		monthFrom = slotendMonth
		dayFrom = slotendDay
	}

	temp := DividendsData{Dividends: fetchedData}

	c.data = &temp

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
		t = t.AddDate(0, 0, 0)
		dueDate := target.ExDividendDate
		if len(dueDate) > 10 {
			dueDate = dueDate[0:10] // yyyy-MM-dd
		}
		raw, _ := json.Marshal(target)
		item := persistence.SampleTask{
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
			Metadata:        "INVESTMENT_DIVIDENDS_RECORD",
			Raw:             string(raw),
			Name:            fmt.Sprintf("%v (%v) pays dividends on %v", target.Name, target.Ticker, dueDate),
			Uid:             "INVESTMENT_DIVIDENDS_RECORD_" + target.Ticker,
			AvailableBefore: t,
			DueDate:         dueDate,
			DueTime:         "00:00",
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
