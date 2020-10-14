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
		Db: NewDB(config),
	}
}

func NewSampleTaskDao() (*SampleTaskDao, error) {

	sampleTaskDao := SampleTaskDao{
		Db: DB,
	}
	return &sampleTaskDao, nil
}

func (s *SampleTaskDao) Upsert(t *SampleTask) {
	prevReport := SampleTask{}
	err := s.Db.Where("uid = ?", t.Uid).Last(&prevReport).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		err :=s.Db.Create(&t).Error
		if err != nil {
			fmt.Println(err, t.ID)
		}
	} else {
		//Update the SampleTask for only Content, DueDate, availableBefore, DueTime
		s.Db.Model(&t).Select("content", "due_date", "due_time", "available_before").
			Updates(map[string]interface{}{
				"content": t.Content,
				"due_date": t.DueDate,
				"due_time": t.DueTime,
				"available_before": t.AvailableBefore,
			})
	}
}

//func (s *SampleTaskDao) Upsert(t *SampleTask) {
//	query := fmt.Sprintf(`INSERT INTO "template".sample_tasks  (
//		id,created_at,updated_at,metadata,content,name,uid) VALUES (nextval('template.sample_task_sequence'),
//		"%v","%v","%v","%v","%v","%v"
//	) ON CONFLICT (uid) DO UPDATE
//		SET updated_at = "%v",
//		available_before = "%v"
//	`,
//		t.CreatedAt,
//		t.UpdatedAt,
//		t.Metadata,
//		t.Content,
//		t.Name,
//		t.Uid,
//		t.UpdatedAt,
//		t.AvailableBefore,
//	)
//	s.db.Exec(query)
//}