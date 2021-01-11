package service

import (
	"github.com/singerdmx/BulletJournal/daemon/consts"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"strconv"
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

// Clean all outdated tasks for projects who have setting auto_delete is true
func (c * Cleaner) CleanOutdatedTasks() {
	sess, err := postgresql.Open(c.Settings)
	if err != nil {
		log.Fatal(err)
		return
	}
	defer sess.Close()
	rows, err := sess.Query("select project_id from project_settings where auto_delete=true")
	if err != nil {
		log.Error(err)
		return
	}
	defer rows.Close()

	var projectIdList []int64
	for rows.Next() {
		var projectId int64
		if err := rows.Scan(&projectId); err != nil {
			log.Error(err)
			return
		}
		projectIdList = append(projectIdList, projectId)
	}
	if len(projectIdList) == 0 {
		return
	}
	projectIdListString := "("
	for _, projectId := range projectIdList {
		projectIdListString = projectIdListString + strconv.FormatInt(projectId, 10) + ","
	}
	projectIdListString = projectIdListString[ : len(projectIdListString) - 1] + ")"

	// construct timestamp as now - 1 day
	targetTime := time.Now().AddDate(0, 0, -1).Format("2006-01-02 15:04:05")
	queryString := "delete from tasks where project_id in " + projectIdListString +
		" and end_time is not null and end_time < timestamp '" + targetTime + "'"
	res, err := sess.Exec(queryString)
	if err != nil {
		log.Errorf("Failed to clean up outdated tasks, err: %v", err)
	} else if res != nil {
		num, _ := res.RowsAffected()
		log.Infof("Cleaned %v outdated tasks for projects %v before %v", num, projectIdListString, targetTime)
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
	c.CleanOutdatedTasks()
}
