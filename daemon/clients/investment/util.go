package investment

import (
	"strconv"
	"time"
)

const Layout string = "2020-01-01 00:00"

func parseDateTime(s string) (time.Time, error) {
	return time.Parse(Layout, s)
}

func Date(year, month, day int) time.Time {
	return time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
}

func intervalInDays(startDate time.Time, endDate time.Time) int {
	return int(endDate.Sub(startDate).Hours() / 24)
}

func dateFormatter(year int, month time.Month, day int) (date string) {
	var dateRes string

	if int(month) < 10 {
		dateRes = strconv.Itoa(year) + "-0" + strconv.Itoa(int(month))
	} else {
		dateRes = strconv.Itoa(year) + "-" + strconv.Itoa(int(month))
	}

	if int(day) < 10 {
		dateRes = dateRes + "-0" + strconv.Itoa(day)
	} else {
		dateRes = dateRes + "-" + strconv.Itoa(day)
	}

	return dateRes
}