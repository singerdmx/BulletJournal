package persistence

import "time"

type SampleTask struct {
	ID					uint64 		`db:"id"`
	CreatedAt			time.Time 	`db:"created_at"`
	UpdatedAt			time.Time 	`db:"updated_at"`
	MetaData			string 		`db:"metadata"`
	Content				string 		`db:"content"`
	Name				string		`db:"name"`
	Uid					string		`db:"uid"`
	AvailableBefore		string 	    `db:"available_before"`	// TODO
	ReminderBeforeTask 	int 		`db:"reminder_before_task"`
	DueDate				string		`db:"due_date"`
	DueTime 			string		`db:"due_time"`
}