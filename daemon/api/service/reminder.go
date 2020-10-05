package service

import (
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"time"
)

type Reminder struct {
}

func (r *Reminder) remind(params ...interface{}) {
	logger := *logging.GetLogger()
	logger.Infof("Reminder starts at %v", time.Now().In(params[0].(*time.Location)).Format(time.RFC3339))
}
