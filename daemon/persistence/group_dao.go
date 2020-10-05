package persistence

import (
	"context"

	"gorm.io/gorm"
)

type GroupDao struct {
	Ctx context.Context
	db  *gorm.DB
}

func NewGroupDao(ctx context.Context) *GroupDao {
	return &GroupDao{
		Ctx: ctx,
		db:  DB,
	}
}

var groupDao *GroupDao

func (g *GroupDao) FindGroup(groupId uint64) *Group {
	var group *Group
	g.db.Where("id = ?", groupId).First(&group)
	return group
}

func (g *GroupDao) Find(groupId uint64) *Group {
	return g.FindGroup(groupId)
}
