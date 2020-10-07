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

// func (s *SampleTaskDao) Upsert(t *SampleTask) {
// 	query := fmt.Sprintf(`INSERT INTO "template".sample_tasks  (
// 		id,created_at,updated_at,metadata,content,name,uid) VALUES (nextval('template.sample_task_sequence'),
// 		"%v","%v","%v","%v","%v","%v"
// 	) ON CONFLICT (uid) DO UPDATE
// 		SET updated_at = "%v",
// 		available_before = "%v"
// 	`,
// 		t.CreatedAt,
// 		t.UpdatedAt,
// 		t.Metadata,
// 		t.Content,
// 		t.Name,
// 		t.Uid,
// 		t.UpdatedAt,
// 		t.AvailableBefore,
// 	)
// 	s.db.Exec(query)
// }