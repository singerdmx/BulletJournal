package models

import (
	"time"
)

type Group struct {
	ID           uint      `db:"id"`
	CreatedAt    time.Time `db:"created_at"`
	UpdatedAt    time.Time `db:"updated_at"`
	Name         string    `db:"name"`
	Owner        string    `db:"owner"`
	DefaultGroup string    `db:"default_group"`
}
