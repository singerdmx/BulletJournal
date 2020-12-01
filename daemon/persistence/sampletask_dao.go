package persistence

import (
	"context"
	"errors"
	"time"

	"github.com/singerdmx/BulletJournal/daemon/logging"
	"gorm.io/gorm"
)

const LAYOUT = "2006-01-02"

type SampleTaskDao struct {
	Ctx context.Context
	Db  *gorm.DB
}

func NewSampleTaskDao(ctx context.Context, db *gorm.DB) (*SampleTaskDao, error) {
	return &SampleTaskDao{
		Ctx: ctx,
		Db:  db, // NewDB(config),
	}, nil
}

func (s *SampleTaskDao) Upsert(t *SampleTask) (uint64, bool) {
	logger := *logging.GetLogger()

	prevReport := SampleTask{}
	r := s.Db.Where("uid = ?", t.Uid).Last(&prevReport)

	if errors.Is(r.Error, gorm.ErrRecordNotFound) {
		// If current time is more recent than duedate, skip this instance
		dueDate, err := time.Parse(LAYOUT, t.DueDate)
		if err != nil {
			logger.Errorf("due date parse to format yyyy-mm-dd failed, duedate: %s, error: %v", t.DueDate, err)
			return 0, false
		}
		if dueDate.Before(time.Now()) {
			return 0, false
		}

		if err := s.Db.Create(&t).Error; err != nil {
			logger.Errorf("Create Sample Task Error: %v", err)
			return 0, false
		}
		return t.ID, true
	}

	// in case controller didn't receive the call
	//if t.Raw == prevReport.Raw {
	//	return 0, false
	//}

	// Update all tasks referring this sample task if they have different name
	if t.Name != prevReport.Name {
		s.Db.Exec("update tasks set name = ? where sample_task_id = ?", t.Name, t.ID)
	}

	// Update the SampleTask for only Content, DueDate, availableBefore, DueTime
	s.Db.Model(&t).Where("uid = ?", t.Uid).Select("raw", "due_date", "due_time", "available_before", "name").
		Updates(map[string]interface{}{
			"raw":              t.Raw,
			"due_date":         t.DueDate,
			"due_time":         t.DueTime,
			"available_before": t.AvailableBefore,
			"name":             t.Name,
		})
	return prevReport.ID, false
}
