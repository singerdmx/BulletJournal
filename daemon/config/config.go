package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

var (
	configNameProd = "prod-config.yaml"
	configNameTest = "test-config.yaml"
	configType     = "type"
	configPaths    = []string{
		"./config",
	}
)

type Config struct {
	Username      string
	Password      string
	Database      string
	Port          string
	Host          string
	DBDriver      string
	ApiKeyPublic  string
	ApiKeyPrivate string
}

var daemonServiceConfig Config

func GetConfig() *Config {
	if IsValid(&daemonServiceConfig) {
		log.Fatal("invalid configuration")
	}

	return &daemonServiceConfig
}

func IsValid(c *Config) bool {
	valid := true
	if c.Username == "" {
		valid = false
		_ = fmt.Errorf("username is missing from config")
	}
	if c.Password == "" {
		valid = false
		_ = fmt.Errorf("password is missing from config")
	}
	if c.Database == "" {
		valid = false
		_ = fmt.Errorf("database is missing from config")
	}
	if c.Host == "" {
		valid = false
		_ = fmt.Errorf("host is missing from config")
	}
	if c.Port == "" {
		valid = false
		_ = fmt.Errorf("port is missing from config")
	}
	if c.DBDriver == "" {
		valid = false
		_ = fmt.Errorf("dbdriver is missing from config")
	}
	if c.ApiKeyPublic == "" {
		valid = false
		_ = fmt.Errorf("apikeypublic is missing from config")
	}
	if c.ApiKeyPrivate == "" {
		valid = false
		_ = fmt.Errorf("apikeyprivate is missing from config")
	}

	return valid
}

func SetProdConfig() {
	setConfig(configNameProd)
}

func SetTestConfig() {
	setConfig(configNameTest)
}

func setConfig(configName string) {
	viper.SetConfigName(configName)

	for _, p := range configPaths {
		viper.AddConfigPath(p)
	}

	viper.SetConfigType(configType)
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("could not read config file: %v", err)
	}

	err = viper.Unmarshal(&daemonServiceConfig)
	if err != nil {
		log.Fatalf("could not decode config into struct: %v", err)
	}

	fmt.Printf("Username from config: %s\n", daemonServiceConfig.Username)
	fmt.Printf("Password from config: %s\n", daemonServiceConfig.Password)
	fmt.Printf("Database from config: %s\n", daemonServiceConfig.Database)
	fmt.Printf("Port from config: %s\n", daemonServiceConfig.Port)
	fmt.Printf("HOST from config: %s\n", daemonServiceConfig.Host)
	fmt.Printf("DB Driver from config: %s\n", daemonServiceConfig.DBDriver)
	fmt.Printf("ApiKeyPublic from config: %s\n", daemonServiceConfig.ApiKeyPublic)
	fmt.Printf("ApiKeyPrivate from config: %s\n", daemonServiceConfig.ApiKeyPrivate)
}
