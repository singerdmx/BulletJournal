package logging

import (
	"go.uber.org/zap"
)

func InitLogging(setting string) (*zap.Logger) {
	
	logger, _ := zap.NewProduction()
	if setting == "dev" {
		logger, _ = zap.NewDevelopment()
	}

	return logger
}