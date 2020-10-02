package investment

import "time"

const Layout string = "2020-01-01 00:00"

func parseDateTime(s string) (time.Time, error) {
	return time.Parse(Layout, s)
}