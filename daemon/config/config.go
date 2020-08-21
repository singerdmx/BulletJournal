package config

import (
	"flag"
	"fmt"
	"log"

	"github.com/spf13/viper"
)

var (
	configNameBase = "base-config.yaml"
	configNameProd = "prod-config.yaml"
	configNameTest = "test-config.yaml"
	configType     = "yaml"
	configPaths    = []string{
		"./config",
	}
)

type Config struct {
	Username      string
	Password      string
	Database      string
	DBPort        string
	RPCPort       string
	HttpPort      string
	Host          string
	DBDriver      string
	ApiKeyPublic  string
	ApiKeyPrivate string
}

var serviceConfig Config

func GetConfig() *Config {
	if Validate(&serviceConfig) == false {
		log.Fatal("Invalid configuration")
	}

	PrintConfig()
	return &serviceConfig
}

func Validate(c *Config) bool {
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
	if c.DBPort == "" {
		valid = false
		_ = fmt.Errorf("database port is missing from config")
	}
	if c.HttpPort == "" {
		valid = false
		_ = fmt.Errorf("http port is missing from config")
	}
	if c.RPCPort == "" {
		valid = false
		_ = fmt.Errorf("rpc port is missing from config")
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

func InitConfig() {
	isProd := flag.Bool("prod", false, "set config to production env")
	flag.Parse()

	SetConfig(configNameBase)
	if *isProd == true {
		SetProdConfig()
	} else {
		SetTestConfig()
	}
}

func SetProdConfig() {
	SetConfig(configNameProd)
}

func SetTestConfig() {
	SetConfig(configNameTest)
}

func SetConfig(configName string) {
	viper.SetConfigName(configName)

	for _, p := range configPaths {
		viper.AddConfigPath(p)
	}

	viper.SetConfigType(configType)
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("could not read config file: %v", err)
	}

	err = viper.Unmarshal(&serviceConfig)
	if err != nil {
		log.Fatalf("could not decode config into struct: %v", err)
	}

}

func PrintConfig() {
	fmt.Printf("Username: %s\n", serviceConfig.Username)
	fmt.Printf("Password: %s\n", serviceConfig.Password)
	fmt.Printf("Database: %s\n", serviceConfig.Database)
	fmt.Printf("DB Port: %s\n", serviceConfig.DBPort)
	fmt.Printf("Rpc Port: %s\n", serviceConfig.RPCPort)
	fmt.Printf("Http Port: %s\n", serviceConfig.HttpPort)
	fmt.Printf("Host: %s\n", serviceConfig.Host)
	fmt.Printf("DB Driver: %s\n", serviceConfig.DBDriver)
	fmt.Printf("ApiKeyPublic: %s\n", serviceConfig.ApiKeyPublic)
	fmt.Printf("ApiKeyPrivate: %s\n", serviceConfig.ApiKeyPrivate)
}
