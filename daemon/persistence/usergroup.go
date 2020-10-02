package persistence

type UserGroupKey struct {
	UserID  int64
	GroupID int64
}

type UserGroup struct {
	ID    UserGroupKey	`gorm:"embedded"`
	User  User
	Group Group
}
