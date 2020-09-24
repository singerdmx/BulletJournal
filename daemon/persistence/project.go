package persistence

import "time"

//PublicProjectItem ...Map to table name public_project_items
type PublicProjectItem struct {
	ID             uint      `db:"id"`
	CreatedAt      time.Time `db:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"`
	ExpirationTime time.Time `db:"expiration_time"`
	Username       string    `db:"username"`
	NoteID         uint      `db:"note_id"`
	TaskID         uint      `db:"task_id"`
}