package persistence

type UserGroupKey struct {
	UserID  int64 `gorm:"primaryKey;autoIncrement:false"`
	GroupID int64 `gorm:"primaryKey;autoIncrement:false"`
}

type UserGroup struct {
	ID    UserGroupKey	`gorm:"embedded"`
	User  User
	Group Group
}
