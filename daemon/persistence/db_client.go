package persistence

import (
	"fmt"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var log logging.Logger
var DB *gorm.DB

func NewDB(config *config.Config) *gorm.DB {
	dbConfig := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s",
		config.Host, config.Username, config.Database, config.Password)
	return GetDB(dbConfig)
}

func GetDB(dbConfig string) *gorm.DB {

	db, err := gorm.Open(postgres.Open(dbConfig), &gorm.Config{})

	if err != nil {
		log.Panic("Database init failed")
		return nil
	}
	db.Logger.LogMode(1)
	return db
}

func init ()  {
	serviceConfig := config.GetConfig()
	DB = NewDB(serviceConfig)
	if DB == nil {
		log.Panic("Database init failed")
	}
}