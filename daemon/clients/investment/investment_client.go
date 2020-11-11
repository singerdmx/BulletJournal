package investment

import (
	"fmt"
	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"time"
)


const (
	expireInDays = 0
)

type void struct{}
var val void

type (
	Extractor interface {
		ProcessData() (*[]uint64, *[]uint64, error)
		toSampleTasks(response [][]byte) ([]persistence.SampleTask, error)
	}

	InvestmentClient struct{
		Category string
		sampleDao  *persistence.SampleTaskDao
		restClient *resty.Client
	}
)

func Init(categoryName string, sampleTaskDao *persistence.SampleTaskDao, restClient *resty.Client) InvestmentClient {
	return InvestmentClient{
		Category: categoryName,
		sampleDao:  sampleTaskDao,
		restClient: restClient,
	}
}

func (c *InvestmentClient) fetchAllData(days int) [][]byte{
	logger := *logging.GetLogger()
	yearFrom, monthFrom, dayFrom := time.Now().AddDate(0, 0, days).Date()
	yearTo, monthTo, dayTo := time.Now().AddDate(0, 1, 0).Date()

	var response [][]byte

	startDate := Date(yearFrom, int(monthFrom), dayFrom)
	endDate := Date(yearTo, int(monthTo), dayTo)

	interval := intervalInDays(startDate, endDate)

	for day := dayFrom; day < interval; day += 2 {
		//start a new date base each loop since month can change
		slotStart := Date(yearFrom, int(monthFrom), dayFrom)

		// check if is ipo

		slotendYear, slotendMonth, slotendDay := slotStart.AddDate(0, 0, 2).Date()

		dateFrom := dateFormatter(yearFrom, monthFrom, dayFrom)
		dateTo := dateFormatter(slotendYear, slotendMonth, slotendDay)

		if c.Category == "ipos" {
			dateTo = dateFormatter(yearTo, monthTo, day+2)
		}

		url := fmt.Sprintf("https://www.benzinga.com/services/webapps/calendar/%+v?pagesize=500&parameters[date_from]=%+v&parameters[date_to]=%+v&parameters[importance]=0", c.Category, dateFrom, dateTo)
		resp, err := c.restClient.R().Get(url)
		if err != nil {
			logger.Error("sending request failed")
			continue
		}
		respBody := []byte(resp.Body())
		response = append(response, respBody)

		if c.Category != "ipos"{
			yearFrom = slotendYear
			monthFrom = slotendMonth
			dayFrom = slotendDay
		}

		time.Sleep(1 * time.Second)
	}
	return response

}

func (c *InvestmentClient) ProcessAllData(days int, e Extractor) (*[]uint64, *[]uint64, error) {
	response := c.fetchAllData(days)
	sampleTasks, _ := e.toSampleTasks(response)

	created := make([]uint64, 0)
	modified := make([]uint64, 0)
	for i := range sampleTasks {
		if entityId, newRecord := c.sampleDao.Upsert(&sampleTasks[i]); newRecord && entityId > 0 {
			created = append(created, entityId)
		} else if !newRecord && entityId > 0 {
			modified = append(modified, entityId)
		}
	}

	return &created, &modified, nil
}
