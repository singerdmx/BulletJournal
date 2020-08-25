package dao

import (
	"github.com/singerdmx/BulletJournal/daemon/config"
	log "github.com/singerdmx/BulletJournal/daemon/logging"
	"time"
	"upper.io/db.v3"
	"upper.io/db.v3/postgresql"
)

const (
	// Configuration value
	intervalInSeconds       = 20000
	historyMaxRetentionDays = 365
)

var settings postgresql.ConnectionURL

//Map to table name auditables
type Auditable struct {
	ID            uint      `db:"id"`
	CreatedAt     time.Time `db:"created_at"`
	UpdatedAt     time.Time `db:"updated_at"`
	Activity      string    `db:"activity"`
	Originator    string    `db:"originator"`
	ProjectId     uint      `db:"project_id"`
	ActivityTime  time.Time `db:"activity_time"`
	Action        string    `db:"action"`
	ProjectItemId uint      `db:"project_item_id"`
}

//Map to table name google_calendar_projects
type GoogleCalendarProject struct {
	ID         uint      `db:"id"`
	CreatedAt  time.Time `db:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"`
	Channel    string    `db:"channel"`
	ChannelId  uint      `db:"channel_id"`
	ProjectId  uint      `db:"project_id"`
	Token      string    `db:"token"`
	Owner      string    `db:"owner"`
	Expiration time.Time `db:"expiration"`
}

//Map to table name notifications
type Notification struct {
	ID         uint      `db:"id"`
	CreatedAt  time.Time `db:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"`
	Actions    string    `db:"actions"`
	Content    string    `db:"content"`
	ContentId  uint      `db:"content_id"`
	Link       string    `db:"link"`
	Originator string    `db:"originator"`
	TargetUser string    `db:"target_user"`
	Title      string    `db:"title"`
	Type       string    `db:"type"`
}

//Map to table name public_project_items
type PublicProjectItem struct {
	ID             uint      `db:"id"`
	CreatedAt      time.Time `db:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"`
	ExpirationTime time.Time `db:"expiration_time"`
	Username       string    `db:"username"`
	NoteId         uint      `db:"note_id"`
}

func getExpiringGoogleCalendarProjects(tableName string) []GoogleCalendarProject {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal(err)
	}
	defer sess.Close()

	t := time.Now()
	t.AddDate(0, 0, 1)
	var expirationTimeBeforeCond = db.Cond{
		"expiration <": t,
	}

	var googleCalendarProjects []GoogleCalendarProject
	err = sess.Collection(tableName).Find(expirationTimeBeforeCond).All(&googleCalendarProjects)
	if err != nil {
		log.Fatal(err)
	}

	return googleCalendarProjects
}

func deleteFromTableByCond(cond db.Cond, tableName string) {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal(err)
	}
	defer sess.Close()

	table := sess.Collection(tableName)

	res := table.Find(cond)

	res.Delete()
}

func deleteByUpdatedAtBefore(t time.Time, tableName string) {
	var updatedAtBeforeCond = db.Cond{
		"updated_at <": t,
	}
	deleteFromTableByCond(updatedAtBeforeCond, tableName)
}

func deleteByExpirationTimeBefore(tableName string) {
	var expirationTimeBeforeCond = db.Cond{
		"expiration_time <": time.Now(),
	}
	deleteFromTableByCond(expirationTimeBeforeCond, tableName)
}

func renewExpiringGoogleCalendarWatch() {
	googleCalendarProjects := getExpiringGoogleCalendarProjects("google_calendar_projects")
	for _, googleCalendarProject := range googleCalendarProjects {
		log.Printf("%q (ID: %d)\n", googleCalendarProject.Owner, googleCalendarProject.ID)
		//TODO Renew based on google Calendar service
	}
}

func PopulateConfiguration() *postgresql.ConnectionURL {
	serviceConfig := config.GetConfig()
	settings = postgresql.ConnectionURL{
		Host:     serviceConfig.Host + ":" + serviceConfig.DBPort,
		Database: serviceConfig.Database,
		User:     serviceConfig.Username,
		Password: serviceConfig.Password,
	}
	return &settings
}

func Clean(maxRetentionTimeInDays int) {
	t := time.Now()
	t.AddDate(0, 0, -maxRetentionTimeInDays)
	log.Println(t)
	PopulateConfiguration()
	deleteByUpdatedAtBefore(t, "notifications")
	deleteByUpdatedAtBefore(t, "auditables")
	deleteByExpirationTimeBefore("public_project_items")
	renewExpiringGoogleCalendarWatch()
}

//func main()  {
//	Clean()
//}
