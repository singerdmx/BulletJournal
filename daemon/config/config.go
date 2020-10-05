package config

import (
	"flag"
	"fmt"
	"log"
	"testing"

	"github.com/spf13/viper"
)

var (
	serviceConfig  Config
	environment    string
	configNameBase = "config.yaml"
	configNameProd = "config-prod.yaml"
	configNameDev  = "config-dev.yaml"
	configType     = "yaml"
	configPaths    = []string{
		"./config",
		"../config",
	}
)

type Config struct {
	Username               string
	Password               string
	Database               string
	DBPort                 string
	RedisPort              string
	RPCPort                string
	HttpPort               string
	Host                   string
	DBDriver               string
	ApiKeyPublic           string
	ApiKeyPrivate          string
	MaxRetentionTimeInDays int
	IntervalInSeconds      int
	IntervalInDays         int
}

func GetEnv() *string {
	return &environment
}

func GetConfig() *Config {
	if Validate(&serviceConfig) == false {
		log.Fatal("Invalid configuration")
	}

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
	if c.RedisPort == "" {
		valid = false
		_ = fmt.Errorf("redis port is missing from config")
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
	if c.IntervalInSeconds == 0 {
		valid = false
		_ = fmt.Errorf("interval in seconds is missing from config")
	}
	if c.MaxRetentionTimeInDays == 0 {
		valid = false
		_ = fmt.Errorf("max retention time in days is missing from config")
	}

	return valid
}

func InitConfig() {
	isProd := flag.Bool("prod", false, "set config to production env")
	isDev := flag.Bool("dev", false, "set config to development env")
	flag.Parse()
	SetConfig(configNameBase)
	if *isProd == true {
		environment = "prod"
		SetConfig(configNameProd)
	} else {
		if *isDev == false {
			log.Printf("Env is not recognized, default to dev")
		}
		environment = "dev"
		SetConfig(configNameDev)
	}
	PrintConfig()
}

func init() {
	testing.Init()
	InitConfig()
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
	tab := "\t\t\t"
	fmt.Print("****************************************************\n")
	fmt.Printf("Profile:%s%s\n", tab, environment)
	fmt.Printf("Username:%s%s\n", tab, serviceConfig.Username)
	fmt.Printf("Password:%s%s\n", tab, serviceConfig.Password)
	fmt.Printf("Database:%s%s\n", tab, serviceConfig.Database)
	fmt.Printf("Database Port:%s%s\n", tab, serviceConfig.DBPort)
	fmt.Printf("RPC Port:%s%s\n", tab, serviceConfig.RPCPort)
	fmt.Printf("Redis Port:%s%s\n", tab, serviceConfig.RedisPort)
	fmt.Printf("HTTP Port:%s%s\n", tab, serviceConfig.HttpPort)
	fmt.Printf("Host:%s\t%s\n", tab, serviceConfig.Host)
	fmt.Printf("DB Driver:%s%s\n", tab, serviceConfig.DBDriver)
	fmt.Printf("Public APIKey:%s{%s}\n", tab, serviceConfig.ApiKeyPublic)
	fmt.Printf("Private APIKey:%s{%s}\n", tab, serviceConfig.ApiKeyPrivate)
	fmt.Printf("IntervalInSeconds:\t\t%v\n", serviceConfig.IntervalInSeconds)
	fmt.Printf("MaxRetentionTimeInDays:\t\t%v\n", serviceConfig.MaxRetentionTimeInDays)
	fmt.Printf("IntervalInDays:%s%v\n", tab, serviceConfig.IntervalInDays)
	fmt.Print("****************************************************\n")
}
