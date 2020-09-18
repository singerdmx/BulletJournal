package models

import "time"

//GoogleCalendarProject ...Map to table name google_calendar_projects
type GoogleCalendarProject struct {
	ID         uint      `db:"id"`
	CreatedAt  time.Time `db:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"`
	Channel    string    `db:"channel"`
	ChannelID  uint      `db:"channel_id"`
	ProjectID  uint      `db:"project_id"`
	Token      string    `db:"token"`
	Owner      string    `db:"owner"`
	Expiration time.Time `db:"expiration"`
}