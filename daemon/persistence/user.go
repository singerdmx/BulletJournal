package persistence

type User struct {
	ID                 int64
	Role               int
	Points             int
	Timezone           string
	Currency           string
	Language           string
	Email              string
	DataFormat         int
	ReminderBeforeTask int
	Theme              string
}

