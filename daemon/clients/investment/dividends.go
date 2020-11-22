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

type DividendsClient struct {
	InvestmentClient
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

func NewDividendsClient(sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) *DividendsClient {
	return &DividendsClient{
		InvestmentClient: Init("dividends", sampleTaskDao, restClient),
	}
}

func (c *DividendsClient) ProcessData() (*[]uint64, *[]uint64, error) {
	return c.ProcessAllData(-16, c)
}

func (c *DividendsClient) toSampleTasks(response [][]byte) ([]persistence.SampleTask, error) {

	logger := *logging.GetLogger()
	set := make(map[string]void)
	var fetchedData []Dividends
	for _, resp := range response {
		data := DividendsData{}
		if resp == nil || len(resp) == 0 {
			continue
		}
		if err := json.Unmarshal(resp, &data); err != nil {
			//logger.Error(fmt.Sprintf("%s Unmarshal dividends response failed: %s", url, string(resp.Body())))
			logger.Errorf("Unmarshal dividends response failed: %v", resp)
			continue
		}
		fetchedData = append(fetchedData, data.Dividends...)
	}
	temp := DividendsData{Dividends: fetchedData}
	c.data = &temp

	if c.data == nil {
		return nil, errors.New("Empty EarningsData data, please fetch data first.")
	}

	var sampleTasks []persistence.SampleTask
	for i := range c.data.Dividends {
		item := c.toSampleTask(c.data.Dividends[i])
		if _, exists := set[item.Uid]; exists {
			continue
		}
		set[item.Uid] = val
		sampleTasks = append(sampleTasks, item)
	}
	return sampleTasks, nil
}

func (c *DividendsClient) toSampleTask(data Dividends) persistence.SampleTask {
	// for converting one sample task

	availBefore := data.Date
	t, _ := time.Parse(layoutISO, availBefore)
	t = t.AddDate(0, 0, expireInDays)
	dueDate := data.ExDividendDate
	if len(dueDate) > 10 {
		dueDate = dueDate[0:10] // yyyy-MM-dd
	}
	raw, _ := json.Marshal(data)
	item := persistence.SampleTask{
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
		Metadata:        "INVESTMENT_DIVIDENDS_RECORD",
		Raw:             string(raw),
		Name:            fmt.Sprintf("%v (%v) pays dividends on %v", data.Name, data.Ticker, dueDate),
		Uid:             "INVESTMENT_DIVIDENDS_RECORD_" + data.Ticker,
		AvailableBefore: t,
		DueDate:         dueDate,
		DueTime:         "00:00",
		Pending:         true,
		Refreshable:     true,
		TimeZone:        "America/New_York",
	}
	return item

}
