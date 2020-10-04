package investment

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/pkg/errors"

	persistence "github.com/singerdmx/BulletJournal/daemon/persistence"
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
	year, month, _ := time.Now().Date()

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
	case 4, 6, 9, 11:
		dateto = datebase + "-30"
	default:
		dateto = datebase + "-31"
	}

	url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/dividends?tpagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", datefrom, dateto)
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
func(c *DividendsClient) SendData() error{
	if c.data == nil {
		return errors.New("Empty Dividends data, please fetch data first.")
	}
	for i := range c.data.Dividends {
		target := c.data.Dividends[i]
		availBefore := target.Date
		t, _ := time.Parse(layoutISO, availBefore)
		item := persistence.SampleTask{
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
			MetaData:           "INVESTMENT_DIVIDENDS_RECORD",
			Content:            "",
			Name:               target.Name,
			Uid:                target.ID,
			AvailableBefore:    t, //TODO
			DueDate:            "",
			DueTime:            "",
			Pending:            true,
		}
		c.sampleDao.Upsert(&item)
	}
	return nil
}