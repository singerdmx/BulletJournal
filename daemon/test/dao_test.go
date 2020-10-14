package main

// Basic imports
import (
	"log"
	"testing"
	"time"

	"github.com/singerdmx/BulletJournal/daemon/api/service"
	"github.com/singerdmx/BulletJournal/daemon/persistence"

	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"upper.io/db.v3/lib/sqlbuilder"
	"upper.io/db.v3/postgresql"
)

const (
	// Configuration value
	maxRetentionTimeInDays = 20
)

// Define the suite, and absorb the built-in basic suite
// functionality from testify - including a T() method which
// returns the current testing context
type DaoTestSuite struct {
	suite.Suite
	RestAuditables                *uint64
	RestPublicProjectItems        *uint64
	RestNotifications             *uint64
}

func getDbConnection(settings postgresql.ConnectionURL) sqlbuilder.Database {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal(err)
	}
	// defer sess.Close()
	return sess
}

// Insert data for specific models for testing
func seedDataForTesting(sess sqlbuilder.Database) {
	log.Printf("In seedDataForTesting")
	// sess, err := postgresql.Open(settings)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer sess.Close()

	// googleCalendarProjectCollection := sess.Collection("google_calendar_projects")
	//Clean up table before testing
	publicProjectItemCollection := sess.Collection("public_project_items")
	err := publicProjectItemCollection.Truncate()
	if err != nil {
		log.Fatalf("Truncate(): %q\n", err)
	}
	auditableCollection := sess.Collection("auditables")
	err = auditableCollection.Truncate()
	if err != nil {
		log.Fatalf("Truncate(): %q\n", err)
	}
	notificationCollection := sess.Collection("notifications")
	err = notificationCollection.Truncate()
	if err != nil {
		log.Fatalf("Truncate(): %q\n", err)
	}

	sampleTasksCollection := sess.Collection("template.sample_tasks")
	err = sampleTasksCollection.Truncate()
	if err != nil {
		log.Fatalf("Truncate(): %q\n", err)
	}

	// googleCalendarProjectCollection := sess.Collection("google_calendar_projects")
	//Clean up table before testing

	t := time.Now()
	t2 := t.AddDate(0, 0, -maxRetentionTimeInDays-2)
	t3 := t.AddDate(0, 0, 1)

	log.Printf("In seedDataForTesting, start inserting notifications")

	//Insert notifications that is valid for clean
	_, err = notificationCollection.Insert(persistence.Notification{
		ID:         0,
		CreatedAt:  t2,
		UpdatedAt:  t2,
		Actions:    "create a project",
		Content:    "Whoever it is",
		ContentID:  0,
		Link:       "this is a link",
		Originator: "Gaara",
		TargetUser: "Gaara",
		Title:      "Gaara",
		Type:       "Gaara",
	})
	if err != nil {
		log.Fatalf("Inserting notifications with err %v", err)
	}

	//Insert notifications that is not valid for clean
	_, err = notificationCollection.Insert(persistence.Notification{
		ID:         1,
		CreatedAt:  t3,
		UpdatedAt:  t3,
		Actions:    "create a project",
		Content:    "Whoever it is",
		ContentID:  1,
		Link:       "this is a link",
		Originator: "Gaara",
		TargetUser: "Gaara",
		Title:      "Gaara",
		Type:       "Gaara",
	})
	if err != nil {
		log.Fatalf("Inserting notifications with err %v", err)
	}
	log.Printf("In seedDataForTesting, start inserting auditables")
	//Insert notifications that not valid for clean
	_, err = notificationCollection.Insert(persistence.Notification{
		ID:         2,
		CreatedAt:  t,
		UpdatedAt:  t,
		Actions:    "create a project",
		Content:    "Whoever it is",
		ContentID:  2,
		Link:       "this is a link",
		Originator: "Gaara",
		TargetUser: "Gaara",
		Title:      "Gaara",
		Type:       "Gaara",
	})
	if err != nil {
		log.Fatalf("Inserting notifications with err %v", err)
	}

	//Insert auditables that not valid for clean
	_, err = auditableCollection.Insert(persistence.Auditable{
		ID:            2,
		CreatedAt:     t,
		UpdatedAt:     t,
		Activity:      "create a project",
		Originator:    "Whoever it is",
		ProjectID:     0,
		ActivityTime:  t,
		Action:        1,
		ProjectItemID: 2,
	})
	if err != nil {
		log.Fatalf("Inserting auditables with err %v", err)
	}

	//Insert auditables that is valid for clean
	_, err = auditableCollection.Insert(persistence.Auditable{
		ID:            3,
		CreatedAt:     t2,
		UpdatedAt:     t2,
		Activity:      "This will need to be cleaned",
		Originator:    "Whoever it is",
		ProjectID:     0,
		ActivityTime:  t2,
		Action:        3,
		ProjectItemID: 3,
	})
	if err != nil {
		log.Fatalf("Inserting auditables with err %v", err)
	}

	//Insert auditables that is not valid for clean
	_, err = auditableCollection.Insert(persistence.Auditable{
		ID:            4,
		CreatedAt:     t3,
		UpdatedAt:     t3,
		Activity:      "This will need to be cleaned",
		Originator:    "Whoever it is",
		ProjectID:     0,
		ActivityTime:  t3,
		Action:        3,
		ProjectItemID: 3,
	})
	if err != nil {
		log.Fatalf("Inserting auditables with err %v", err)
	}

	//Insert public_project_items not valid for clean
	_, err = publicProjectItemCollection.Insert(persistence.PublicProjectItem{
		ID:             1,
		CreatedAt:      t,
		UpdatedAt:      t,
		ExpirationTime: t3,
		Username:       "Gaara",
		NoteID:         100,
		TaskID:         1,
	})
	if err != nil {
		log.Fatalf("Inserting public_project_items with err %v", err)
	}

	//Insert public_project_items valid for clean
	_, err = publicProjectItemCollection.Insert(persistence.PublicProjectItem{
		ID:             2,
		CreatedAt:      t2,
		UpdatedAt:      t2,
		ExpirationTime: t,
		Username:       "Gaara",
		NoteID:         101,
		TaskID:         2,
	})
	if err != nil {
		log.Fatalf("Inserting public_project_items with err %v", err)
	}

	// _, err = sampleTasksCollection.Insert(persistence.SampleTask{
	// 	ID:              1,
	// 	CreatedAt:       t2,
	// 	UpdatedAt:       t2,
	// 	MetaData:        "IPO",
	// 	Content:         "Test Content",
	// 	Name:            "Test Name",
	// 	Uid:             "1000",
	// 	AvailableBefore: t2.String(),
	// 	// ReminderBeforeTask: 1,
	// 	DueDate: "2020-02-20",
	// 	DueTime: "",
	// })
	// if err != nil {
	// 	log.Fatalf("Inserting sampleTask item failed with err %v", err)
	// }
}

// func upsertTest() {
// 	item := persistence.SampleTask{
// 		CreatedAt:          time.Now(),
// 		UpdatedAt:          time.Now(),
// 		MetaData:           "INVESTMENT_IPO_RECORD",
// 		Content:            "",
// 		Name:               "",
// 		Uid:                "",
// 		AvailableBefore:    time.Now().String(), //TODO
// 		ReminderBeforeTask: 0,
// 		DueDate:            "",
// 		DueTime:            "",
// 	}
// 	persistence.NewSampleTaskDao().Upsert(&item)
// }

func cleanUpTables(sess sqlbuilder.Database) {
	publicProjectItemCollection := sess.Collection("public_project_items")
	err := publicProjectItemCollection.Truncate()
	if err != nil {
		log.Fatalf("Truncate(): %q\n", err)
	}
	auditableCollection := sess.Collection("auditables")
	err = auditableCollection.Truncate()
	if err != nil {
		log.Fatalf("Truncate(): %q\n", err)
	}
	notificationCollection := sess.Collection("notifications")
	err = notificationCollection.Truncate()
	if err != nil {
		log.Fatalf("Truncate(): %q\n", err)
	}
}

func (suite *DaoTestSuite) SetupTest() {
	logging.InitLogging(config.GetEnv())
	serviceConfig := config.GetConfig()
	cleaner := service.Cleaner{
		Settings: postgresql.ConnectionURL{
			Host:     serviceConfig.Host + ":" + serviceConfig.DBPort,
			Database: serviceConfig.Database,
			User:     serviceConfig.Username,
			Password: serviceConfig.Password,
		},
	}
	sess := getDbConnection(cleaner.Settings)
	defer sess.Close()
	seedDataForTesting(sess)
	cleaner.Clean(maxRetentionTimeInDays)
	suite.RestAuditables = cleaner.CountForTable("auditables")
	suite.RestPublicProjectItems = cleaner.CountForTable("public_project_items")
	suite.RestNotifications = cleaner.CountForTable("notifications")
	assert.Equal(suite.T(), uint64(2), *suite.RestAuditables)
	assert.Equal(suite.T(), uint64(1), *suite.RestPublicProjectItems)
	assert.Equal(suite.T(), uint64(2), *suite.RestNotifications)
	//Clean up tables after testing
	cleanUpTables(sess)
}

// All methods that begin with "Test" are run as tests within a
// suite.
func (suite *DaoTestSuite) TestDao() {
	// assert.Equal(suite.T(), uint64(2), *suite.RestAuditables)
	// assert.Equal(suite.T(), uint64(1), *suite.RestPublicProjectItems)
	// assert.Equal(suite.T(), uint64(2), *suite.RestNotifications)
}

// In order for 'go test' to run this suite, we need to create
// a normal test function and pass our suite to suite.Run
func TestDaoTestSuite(t *testing.T) {
	suite.Run(t, new(DaoTestSuite))
}
