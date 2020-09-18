package services

import (
	"github.com/singerdmx/BulletJournal/daemon/models"
	"time"

	"github.com/singerdmx/BulletJournal/daemon/logging"
	"upper.io/db.v3"
	"upper.io/db.v3/postgresql"
)

var log logging.Logger

//Cleaner ...
type Cleaner struct {
	Settings postgresql.ConnectionURL
	Service  Streaming
}

func (c *Cleaner) getExpiringGoogleCalendarProjects(tableName string) []models.GoogleCalendarProject {
	sess, err := postgresql.Open(c.Settings)
	if err != nil {
		log.Fatal(err)
	}
	defer sess.Close()

	t := time.Now()
	t.AddDate(0, 0, 1)
	var expirationTimeBeforeCond = db.Cond{
		"expiration <": t,
	}

	var googleCalendarProjects []models.GoogleCalendarProject
	err = sess.Collection(tableName).Find(expirationTimeBeforeCond).All(&googleCalendarProjects)
	if err != nil {
		log.Fatal(err)
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

func (c *Cleaner) renewExpiringGoogleCalendarWatch() {
	googleCalendarProjects := c.getExpiringGoogleCalendarProjects("google_calendar_projects")
	for _, googleCalendarProject := range googleCalendarProjects {
		log.Printf("%q (ID: %d)\n", googleCalendarProject.Owner, googleCalendarProject.ID)
		c.Service.ServiceChannel <- &StreamingMessage{Message: googleCalendarProject.ProjectID}
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
	t := time.Now()
	t = t.AddDate(0, 0, -maxRetentionTimeInDays)
	log.Infof("Cleaner starts at %v", t.Format(time.RFC3339))
	c.deleteByUpdatedAtBefore(t, "notifications")
	c.deleteByUpdatedAtBefore(t, "auditables")
	c.deleteByExpirationTimeBefore("public_project_items")
	c.renewExpiringGoogleCalendarWatch()
}

//Close ...Close channel
func (c *Cleaner) Close() {
	close(c.Service.ServiceChannel)
}
