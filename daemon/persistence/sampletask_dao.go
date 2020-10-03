package persistence

import (
	"fmt"
	"context"
	"github.com/pkg/errors"
	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type SampleTaskDao struct {
	Ctx context.Context
	pgc *PostgresClient
	log *logging.Logger
}

func NewSampleTaskDao() (*SampleTaskDao, error) {
	pgc := GetPostgresClient()
	if pgc == nil {
		return nil, errors.New("Sample Task DAO get PSQL client failed")
	}
	return &SampleTaskDao{
		log: logging.GetLogger(),
		pgc: pgc,
	}, nil
}

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
		due_time,
		time_zone,
	) values(
		%v,%v,%v,%v,%v,%v,%v,%v,%v,%v, "America/New_York"
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