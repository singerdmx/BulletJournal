package persistence

import (
	"context"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"gorm.io/gorm"
)

type UserGroupDao struct {
	Ctx context.Context
	db *gorm.DB
	log *logging.Logger
}

func (u *UserGroupDao) Find(key UserGroupKey) (UserGroup, error) {
	var userGroup UserGroup
	if err := u.db.First(&userGroup, key).Error; err != nil {
		return UserGroup{}, err
	}
	return userGroup, nil
}

func (u *UserGroupDao) Save(userGroup UserGroup) error {
	if err := u.db.Create(userGroup).Error; err != nil {
		return err
	}
	return nil
}
