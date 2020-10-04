package service

import (
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"time"
)

//Cleaner ...
type Investment struct {
}

//Clean ...Main method for executing cleaning jobs
func (i *Investment) Pull(params ...interface{}) {
	logger := *logging.GetLogger()
	logger.Infof("Investment starts at %v", time.Now().In(params[0].(*time.Location)).Format(time.RFC3339))
}
