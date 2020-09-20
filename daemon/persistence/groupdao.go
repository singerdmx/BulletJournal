package persistence

import (
	"context"
	"github.com/singerdmx/BulletJournal/daemon/logging"
)

type GroupDao struct {
	Ctx context.Context
	pgc *PostgresClient
	log *logging.Logger
}

var groupDao *GroupDao

func (g *GroupDao) SetLogger() {
	g.log = logging.GetLogger()
}

func (g *GroupDao) SetClient() {
	g.pgc = GetPostgresClient()
}

func (g *GroupDao) NewGroupDao() {
	if g.log == nil {
		g.SetLogger()
	}
	if g.pgc == nil {
		g.SetClient()
	}
}

func (g *GroupDao) FindGroup(groupId uint64) *Group {
	var group *Group
	g.pgc.GetClient().Where("id = ?", groupId).First(&group)
	return group
}

func GetGroupDao() *GroupDao {
	if groupDao.pgc == nil || groupDao.log == nil {
		groupDao.NewGroupDao()
	}
	return groupDao
}

func Find(groupId uint64) *Group {
	return GetGroupDao().FindGroup(groupId)
}