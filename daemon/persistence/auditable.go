package persistence

import "time"

//Auditable ...Map to table name auditables
type Auditable struct {
	ID            uint      `db:"id"`
	CreatedAt     time.Time `db:"created_at"`
	UpdatedAt     time.Time `db:"updated_at"`
	Activity      string    `db:"activity"`
	Originator    string    `db:"originator"`
	ProjectID     uint      `db:"project_id"`
	ActivityTime  time.Time `db:"activity_time"`
	Action        uint      `db:"action"`
	ProjectItemID uint      `db:"project_item_id"`
}