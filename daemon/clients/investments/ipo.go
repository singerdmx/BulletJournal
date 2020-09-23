package main

import (
	"fmt"
	"time"
	"encoding/json"
	"strconv"

  	"github.com/go-resty/resty"
)

// Serializer for NasDaq response
type NasdaqResponse struct {
	Data struct {
		Priced struct {
			Headers struct {
				ProposedTickerSymbol       string `json:"proposedTickerSymbol"`
				CompanyName                string `json:"companyName"`
				ProposedExchange           string `json:"proposedExchange"`
				ProposedSharePrice         string `json:"proposedSharePrice"`
				SharesOffered              string `json:"sharesOffered"`
				PricedDate                 string `json:"pricedDate"`
				DollarValueOfSharesOffered string `json:"dollarValueOfSharesOffered"`
				DealStatus                 string `json:"dealStatus"`
			} `json:"headers"`
			Rows []struct {
				DealID                     string `json:"dealID"`
				ProposedTickerSymbol       string `json:"proposedTickerSymbol"`
				CompanyName                string `json:"companyName"`
				ProposedExchange           string `json:"proposedExchange"`
				ProposedSharePrice         string `json:"proposedSharePrice"`
				SharesOffered              string `json:"sharesOffered"`
				PricedDate                 string `json:"pricedDate"`
				DollarValueOfSharesOffered string `json:"dollarValueOfSharesOffered"`
				DealStatus                 string `json:"dealStatus"`
			} `json:"rows"`
		} `json:"priced"`
		Upcoming struct {
			UpcomingTable struct {
				Headers struct {
					ProposedTickerSymbol       string `json:"proposedTickerSymbol"`
					CompanyName                string `json:"companyName"`
					ProposedExchange           string `json:"proposedExchange"`
					ProposedSharePrice         string `json:"proposedSharePrice"`
					SharesOffered              string `json:"sharesOffered"`
					ExpectedPriceDate          string `json:"expectedPriceDate"`
					DollarValueOfSharesOffered string `json:"dollarValueOfSharesOffered"`
				} `json:"headers"`
				Rows []struct {
					DealID                     string `json:"dealID"`
					ProposedTickerSymbol       string `json:"proposedTickerSymbol"`
					CompanyName                string `json:"companyName"`
					ProposedExchange           string `json:"proposedExchange"`
					ProposedSharePrice         string `json:"proposedSharePrice"`
					SharesOffered              string `json:"sharesOffered"`
					ExpectedPriceDate          string `json:"expectedPriceDate"`
					DollarValueOfSharesOffered string `json:"dollarValueOfSharesOffered"`
				} `json:"rows"`
			} `json:"upcomingTable"`
			LastUpdatedTime string `json:"lastUpdatedTime"`
		} `json:"upcoming"`
		Filed struct {
			Headers struct {
				ProposedTickerSymbol       string `json:"proposedTickerSymbol"`
				CompanyName                string `json:"companyName"`
				FiledDate                  string `json:"filedDate"`
				DollarValueOfSharesOffered string `json:"dollarValueOfSharesOffered"`
			} `json:"headers"`
			Rows []struct {
				DealID                     string      `json:"dealID"`
				ProposedTickerSymbol       interface{} `json:"proposedTickerSymbol"`
				CompanyName                string      `json:"companyName"`
				FiledDate                  string      `json:"filedDate"`
				DollarValueOfSharesOffered string      `json:"dollarValueOfSharesOffered"`
			} `json:"rows"`
		} `json:"filed"`
		Withdrawn struct {
			Headers struct {
				ProposedTickerSymbol       string `json:"proposedTickerSymbol"`
				CompanyName                string `json:"companyName"`
				ProposedExchange           string `json:"proposedExchange"`
				SharesOffered              string `json:"sharesOffered"`
				FiledDate                  string `json:"filedDate"`
				DollarValueOfSharesOffered string `json:"dollarValueOfSharesOffered"`
				WithdrawDate               string `json:"withdrawDate"`
			} `json:"headers"`
			Rows []struct {
				DealID                     string      `json:"dealID"`
				ProposedTickerSymbol       interface{} `json:"proposedTickerSymbol"`
				CompanyName                string      `json:"companyName"`
				ProposedExchange           interface{} `json:"proposedExchange"`
				SharesOffered              string      `json:"sharesOffered"`
				FiledDate                  string      `json:"filedDate"`
				DollarValueOfSharesOffered string      `json:"dollarValueOfSharesOffered"`
				WithdrawDate               string      `json:"withdrawDate"`
			} `json:"rows"`
		} `json:"withdrawn"`
		Month        int `json:"month"`
		Year         int `json:"year"`
		TotalResults int `json:"totalResults"`
	} `json:"data"`
	Message interface{} `json:"message"`
	Status  struct {
		RCode            int         `json:"rCode"`
		BCodeMessage     interface{} `json:"bCodeMessage"`
		DeveloperMessage interface{} `json:"developerMessage"`
	} `json:"status"`
}

// Defined according to records on https://www.nasdaq.com/market-activity/ipos 
type IPORecord struct {
	Symbol string 
	Company string 
	ExchangeMarket string 
	Price string 
	Shares string 
	IPODate string 
	OfferAmount string 
}


func fetchInfo() []IPORecord {
	client := resty.New()

	year, month, _:= time.Now().Date()

	var date string

	// Request for IPO info of current month
	if int(month) < 10 {
		date = strconv.Itoa(year) + "-0" + strconv.Itoa(int(month))
	} else {
		date = strconv.Itoa(year) + "-" + strconv.Itoa(int(month))
	}

	resp, err := client.R().
	SetHeader("authority", "api.nasdaq.com").
	SetHeader("accept", "application/json, text/plain */*").
	SetHeader("user-agent", "Mozilla/5.0(X11;Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36").
	SetHeader("origin", "https://www.nasdaq.com").
	SetHeader("sec-fetch-site", "same-site").
	SetHeader("sec-fetch-mode", "cors").
	SetHeader("sec-fetch-dest", "empty").
	SetHeader("referer", "https://www.nasdaq.com/market-activity/ipos").
	SetHeader("accept-language", "zh-CN,zh;q=0.9,zh-TW;q=0.8,en-CA;q=0.7,en;q=0.6").
	Get("https://api.nasdaq.com/api/ipo/calendar?date=" + date)

	if err != nil {
		fmt.Printf("\nError: %v", err)
		return nil
	}

	var data NasdaqResponse

	json.Unmarshal(resp.Body(), &data)

	ipoinfo := make([]IPORecord,0)
	for i := range(data.Data.Upcoming.UpcomingTable.Rows) {
		record := data.Data.Upcoming.UpcomingTable.Rows[i]
		ipoinfo = append(ipoinfo, IPORecord{
			Symbol: record.ProposedTickerSymbol,
			Company: record.CompanyName,
			ExchangeMarket: record.ProposedExchange,
			Price: record.ProposedSharePrice,
			Shares: record.SharesOffered,
			IPODate: record.ExpectedPriceDate,
			OfferAmount: record.DollarValueOfSharesOffered,
		})
	}

	return ipoinfo
}
