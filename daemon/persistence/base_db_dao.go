package persistence

import (
	"context"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"gorm.io/gorm"
)

type BaseDbDao struct {
	Ctx context.Context
	Db  *gorm.DB
}

//GetDbDao... Get dao instance from Context and Config
func (b *BaseDbDao) GetDbDao(ctx context.Context, serviceConfig *config.Config) (dbDao *BaseDbDao) {
	Db := NewDB(serviceConfig)
	dbDao = &BaseDbDao{ctx, Db}
	return
}