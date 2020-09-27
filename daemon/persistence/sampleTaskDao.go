package persistence

import (
	"fmt"
	"context"

	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type SampleTaskDao struct {
	Ctx context.Context
	pgc *PostgresClient
	log *logging.Logger
}

var sampleTaskDao *SampleTaskDao

func (s *SampleTaskDao) SetLogger() {
	s.log = logging.GetLogger()
}

func (s *SampleTaskDao) SetClient() {
	s.pgc =	GetPostgresClient()
}

func (s *SampleTaskDao) NewSampleTaskDao() {
	if s.log == nil {
		s.SetLogger()
	}

	if s.pgc == nil {
		s.SetClient()
	}
}

func GetSampleTaskDao() *SampleTaskDao {
	if sampleTaskDao == nil || sampleTaskDao.log == nil {
		sampleTaskDao.NewSampleTaskDao()
	}

	return sampleTaskDao
}

// func (s *SampleTaskDao) FindSampleTask(sampleTaskId uint64) {
// 	var sampleTask *SampleTask
// 	s.pgc.GetClient().Where("id = ?", sampleTaskId).First()

// 	return sampleTask
// }

func (s *SampleTaskDao) Upsert(sampleTask *SampleTask) {
	var t *SampleTask
	query := fmt.Sprintf(`INSERT INTO template.sampleTasks (
		created_at,
		updated_at,
		metadata,
		content,
		name,
		uid,
		available_before,
		reminder_before_task,
		due_date,
		due_time
	) values(
		%v,%v,%v,%v,%v,%v,%v,%v,%v,%v
	) ON CONFLICT (uid) DO UPDATE
		SET updated_at = %v,
		available_before = %v
	`, 
	t.CreatedAt, 
	t.UpdatedAt, 
	t.MetaData, 
	t.Content, 
	t.Name, 
	t.Uid, 
	t.AvailableBefore,
	t.ReminderBeforeTask,
	t.DueDate,
	t.DueTime,
	t.UpdatedAt,
	t.AvailableBefore,
	)

	s.pgc.GetClient().Exec(query)
}