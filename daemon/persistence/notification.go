package persistence

import "time"

//Notification ...Map to table name notifications
type Notification struct {
	ID         int64      `db:"id"`
	CreatedAt  time.Time `db:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"`
	Actions    string    `db:"actions"`
	Content    string    `db:"content"`
	ContentID  int64      `db:"content_id"`
	Link       string    `db:"link"`
	Originator string    `db:"originator"`
	TargetUser string    `db:"target_user"`
	Title      string    `db:"title"`
	Type       string    `db:"type"`
}