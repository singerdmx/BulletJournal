package persistence

import (
	"context"
	"errors"
	"fmt"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"gorm.io/gorm"
)

type SampleTaskDao struct {
	Ctx context.Context
	Db  *gorm.DB
}

func InitializeSampleTaskDao(config *config.Config, ctx context.Context) *SampleTaskDao {
	return &SampleTaskDao{
		Ctx: ctx,
		Db:  NewDB(config),
	}
}

func NewSampleTaskDao() (*SampleTaskDao, error) {

	sampleTaskDao := SampleTaskDao{
		Db: DB,
	}
	return &sampleTaskDao, nil
}

func (s *SampleTaskDao) Upsert(t *SampleTask) (uint64, bool) {
	prevReport := SampleTask{}
	err := s.Db.Where("uid = ?", t.Uid).Last(&prevReport).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		err := s.Db.Create(&t).Error
		if err != nil {
			fmt.Println(err, t.ID)
		}
		return t.ID, true
	}

	// Update the SampleTask for only Content, DueDate, availableBefore, DueTime
	s.Db.Model(&t).Where("uid = ?", t.Uid).Select("content", "due_date", "due_time", "available_before").
		Updates(map[string]interface{}{
			"content":          t.Content,
			"due_date":         t.DueDate,
			"due_time":         t.DueTime,
			"available_before": t.AvailableBefore,
		})
	return prevReport.ID, false
}
