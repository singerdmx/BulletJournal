package service

import (
	"time"

	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type Job struct {
	Cleaner    *Cleaner
	Investment *Investment
	Reminder   *Reminder
}

func (r *Job) Run(params ...interface{}) {
	logger := *logging.GetLogger()
	timestamp := time.Now().In(params[0].(*time.Location)).Format(time.RFC3339)
	logger.Infof("Daemon job starts at %v", timestamp)
	r.Cleaner.Clean(params[1].(int))
	r.Reminder.remind(params[0])
	r.Investment.pull(params[0])
}
