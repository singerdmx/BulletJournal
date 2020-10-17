package investment

import "time"

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
