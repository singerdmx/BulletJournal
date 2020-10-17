package persistence

import "time"

type SampleTask struct {
	ID              uint64    `json:"id,omitempty" gorm:"primaryKey;not_null"`
	CreatedAt       time.Time `json:"-" gorm:"index:created_at;PRECISION:6"`
	UpdatedAt       time.Time `json:"-" gorm:"PRECISION:6"`
	Metadata        string    `json:"metadata"`
	Content         string    `json:"content"`
	Name            string    `json:"name" gorm:"type:varchar;size:100"`
	Uid             string    `json:"uid" gorm:"type:varchar;size:500"`
	AvailableBefore time.Time `json:"available_before"`
	DueDate         string    `json:"due_date" gorm:"type:varchar;size:15"`
	DueTime         string    `json:"due_time" gorm:"type:varchar;size:10"`
	TimeZone        string    `json:"time_zone" gorm:"type:varchar;size:100"`
	Pending         bool      `json:"pending"`
	Refreshable     bool      `json:"refreshable"`
	Raw             string    `json:"raw"`
}

func (SampleTask) TableName() string {
	return "template.sample_tasks"
}
