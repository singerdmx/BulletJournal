package persistence

import (
	"context"
	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type UserGroupDao struct {
	Ctx context.Context
	pgc *PostgresClient
	log *logging.Logger
}

func (u *UserGroupDao) Find(key UserGroupKey) (UserGroup, error) {
	var userGroup UserGroup
	if err := u.pgc.db.First(&userGroup, key).Error; err != nil {
		return UserGroup{}, err
	}
	return userGroup, nil
}

func (u *UserGroupDao) Save(userGroup UserGroup) error {
	if err := u.pgc.db.Create(userGroup).Error; err != nil {
		return err
	}
	return nil
}
