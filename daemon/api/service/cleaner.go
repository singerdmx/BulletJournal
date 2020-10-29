package service

import (
	"github.com/singerdmx/BulletJournal/daemon/consts"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"time"

	"github.com/singerdmx/BulletJournal/daemon/logging"
	"upper.io/db.v3"
	"upper.io/db.v3/postgresql"
)

var log logging.Logger

//Cleaner ...
type Cleaner struct {
	Settings         postgresql.ConnectionURL
	StreamChannel    chan<- *StreamingMessage
}

func (c *Cleaner) getExpiringGoogleCalendarProjects(tableName string) []persistence.GoogleCalendarProject {
	sess, err := postgresql.Open(c.Settings)
	if err != nil {
		log.Fatal(err)
	}
	defer sess.Close()

	t := time.Now()
	t.AddDate(0, 0, 2)
	var expirationTimeBeforeCond = db.Cond{
		"expiration <": t,
	}

	var googleCalendarProjects []persistence.GoogleCalendarProject
	err = sess.Collection(tableName).Find(expirationTimeBeforeCond).All(&googleCalendarProjects)
	if err != nil {
		log.Error(err)
	}

	return googleCalendarProjects
}

func (c *Cleaner) deleteFromTableByCond(cond db.Cond, tableName string) {
	sess, err := postgresql.Open(c.Settings)
	if err != nil {
		log.Fatal(err)
	}
	defer sess.Close()

	table := sess.Collection(tableName)

	res := table.Find(cond)

	res.Delete()
}

func (c *Cleaner) deleteByUpdatedAtBefore(t time.Time, tableName string) {
	var updatedAtBeforeCond = db.Cond{
		"updated_at <": t,
	}
	c.deleteFromTableByCond(updatedAtBeforeCond, tableName)
}

func (c *Cleaner) deleteByExpirationTimeBefore(tableName string) {
	var expirationTimeBeforeCond = db.Cond{
		"expiration_time <": time.Now(),
	}
	c.deleteFromTableByCond(expirationTimeBeforeCond, tableName)
}

func (c *Cleaner) deleteByAvailableBefore(tableName string) {
	var staleTimeBeforeCond = db.Cond {
		"id >": 91282,
		"available_before IS NOT": nil,
		"available_before <": time.Now(),
	}
	c.deleteFromTableByCond(staleTimeBeforeCond, tableName)
}

func (c *Cleaner) renewExpiringGoogleCalendarWatch() {
	googleCalendarProjects := c.getExpiringGoogleCalendarProjects("google_calendar_projects")
	for _, googleCalendarProject := range googleCalendarProjects {
		log.Printf("%q (ID: %d)\n", googleCalendarProject.Owner, googleCalendarProject.ID)
		c.StreamChannel <- &StreamingMessage{
			Message: uint64(googleCalendarProject.ProjectID),
			ServiceName: consts.CLEANER_SERVICE_NAME}
	}
}

//CountForTable ...Helper method used for testing
func (c *Cleaner) CountForTable(tableName string) *uint64 {
	sess, err := postgresql.Open(c.Settings)
	if err != nil {
		log.Fatal(err)
	}
	defer sess.Close()

	table := sess.Collection(tableName)

	count, err := table.Find().Count()
	log.Infof("Count for %s at %v", tableName, count)
	if err == nil {
		return &count
	}
	return nil
}

//Clean ...Main method for executing cleaning jobs
func (c *Cleaner) Clean(maxRetentionTimeInDays int) {
	log = *logging.GetLogger()
	PST, _ := time.LoadLocation("America/Los_Angeles")
	t := time.Now().In(PST)
	log.Infof("Cleaner starts at %v", t.Format(time.RFC3339))
	log.Infof("With setting %v", c.Settings)
	t = t.AddDate(0, 0, -maxRetentionTimeInDays)
	c.deleteByUpdatedAtBefore(t, "notifications")
	c.deleteByUpdatedAtBefore(t, "auditables")
	c.deleteByExpirationTimeBefore("public_project_items")
	c.deleteByAvailableBefore(`template.sample_tasks`)
	c.renewExpiringGoogleCalendarWatch()
}
