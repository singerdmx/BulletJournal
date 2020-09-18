package clients

import (
	"fmt"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	dbClient *PostgresClient
	dbConfig *PostgreConfig
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

func (p *PostgreConfig) NewDB() {
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

func (p *PostgresClient) GetClient() *gorm.DB {
	if p.db == nil {
		p.log.Fatal("failed to get database client")
	}
	return p.db
}

func GetPostgresClient() *PostgresClient {
	if dbClient.log == nil {
		dbClient.SetLogger()
	}
	if dbClient.db == nil {
		dbConfig.NewDB()
		if db, err := gorm.Open(postgres.Open(dbConfig.GetDSN()), &gorm.Config{}); err != nil {
			dbClient.log.Error(err)
			return nil
		} else {
			dbClient.SetClient(db)
		}
	}
	return dbClient
}
