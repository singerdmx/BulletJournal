package clients

import (
	"fmt"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	dbClient PostgresClient
	dbConfig PostgreConfig
)

type PostgresClient struct {
	db  *gorm.DB
	log *logging.Logger
}

type PostgreConfig struct {
	dbHost   string
	dbName   string
	username string
	password string
}

func (p *PostgreConfig) InitDB() {
	serviceConfig := config.GetConfig()
	p = &PostgreConfig{
		serviceConfig.Host,
		serviceConfig.Database,
		serviceConfig.Username,
		serviceConfig.Password,
	}
}

func (p *PostgreConfig) GetDSN() string {
	return fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", p.dbHost, p.username, p.dbName, p.password)
}

func (p *PostgresClient) SetLogger() {
	p.log = logging.GetLogger()
}

func (p *PostgresClient) SetClient(db *gorm.DB) {
	p.db = db
	if p.db == nil {
		p.log.Fatal("failed to set database client")
	}
}

func (p *PostgresClient) PostgreClient() *PostgresClient {
	if p.log == nil {
		p.SetLogger()
	}
	if dbClient.db == nil {
		dbConfig.InitDB()
		if db, err := gorm.Open(postgres.Open(dbConfig.GetDSN()), &gorm.Config{}); err != nil {
			p.log.Error(err)
			return nil
		} else {
			p.SetClient(db)
		}
	}
	return p
}
