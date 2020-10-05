package persistence

import (
	"context"
	"errors"
	"fmt"
	"gorm.io/gorm"
)

type SampleTaskDao struct {
	Ctx context.Context
	db *gorm.DB
}

func NewSampleTaskDao() (*SampleTaskDao, error) {

	sampleTaskDao := SampleTaskDao{
		db: DB,
	}
	return &sampleTaskDao, nil
}

func (s *SampleTaskDao) Upsert(t *SampleTask) {
	prevReport := SampleTask{}
	err := s.db.Where("uid = ?", t.Uid).Last(&prevReport).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		err :=s.db.Create(&t).Error
		if err != nil {
			fmt.Println(err, t.ID)
		}
	} else {
		s.db.First(&t)
		s.db.Save(&t)
	}
}

//func (s *SampleTaskDao) Upsert(t *SampleTask) {
//	query := fmt.Sprintf(`INSERT INTO template.sampleTasks (
//		created_at,
//		updated_at,
//		metadata,
//		content,
//		name,
//		uid,
//		available_before,
//		reminder_before_task,
//		due_date,
//		due_time
//	) values(
//		%v,%v,%v,%v,%v,%v,%v,%v,%v,%v
//	) ON CONFLICT (uid) DO UPDATE
//		SET updated_at = %v,
//		available_before = %v
//	`,
//		t.CreatedAt,
//		t.UpdatedAt,
//		t.MetaData,
//		t.Content,
//		t.Name,
//		t.Uid,
//		t.AvailableBefore,
//		t.ReminderBeforeTask,
//		t.DueDate,
//		t.DueTime,
//		t.UpdatedAt,
//		t.AvailableBefore,
//	)
	//s.db.Exec(query)
//}