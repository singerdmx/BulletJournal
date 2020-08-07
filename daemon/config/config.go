package main

import (
	"fmt"
	"log"
	"github.com/spf13/viper"
)

var (
	configName  = "prod-config.yaml"
	configType  = "type"
	configPaths = []string{
		"./config",
	}
)

type Config struct {
	Username string
	Password string
	Database string
	Port     string
	Host     string
	DBDriver string
}

func main() {
	viper.SetConfigName(configName)

	for _, p := range configPaths {
		viper.AddConfigPath(p)
	}

	viper.SetConfigType(configType)
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("could not read config file: %v", err)
	}

	var config Config
	err = viper.Unmarshal(&config)
	if err != nil {
		log.Fatalf("could not decode config into struct: %v", err)
	}

	fmt.Printf("Username from config: %s\n", config.Username)
	fmt.Printf("Password from config: %s\n", config.Password)
	fmt.Printf("Database from config: %s\n", config.Database)
	fmt.Printf("Port from config: %s\n", config.Port)
	fmt.Printf("HOST from config: %s\n", config.Host)
	fmt.Printf("DB Driver from config: %s\n", config.DBDriver)

}
