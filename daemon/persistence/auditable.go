package persistence

import "time"

//Auditable ...Map to table name auditables
type Auditable struct {
	ID            int64      `db:"id"`
	CreatedAt     time.Time `db:"created_at"`
	UpdatedAt     time.Time `db:"updated_at"`
	Activity      string    `db:"activity"`
	Originator    string    `db:"originator"`
	ProjectID     int64      `db:"project_id"`
	ActivityTime  time.Time `db:"activity_time"`
	Action        int64      `db:"action"`
	ProjectItemID int64      `db:"project_item_id"`
}