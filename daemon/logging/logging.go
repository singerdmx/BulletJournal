package logging

import (
<<<<<<< HEAD
	"os"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	lumberjack "gopkg.in/natefinch/lumberjack.v2"
)

const (
	Info = "Info"
	Warn = "Warn"
	Debug = "Debug"
)

type daemonLogger struct {
	sugaredLogger *zap.SugaredLogger
}

func getEncoder(isJSON bool) zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	if isJSON {
		return zapcore.NewJSONEncoder(encoderConfig)
	}
	return zapcore.NewConsoleEncoder(encoderConfig)
}

func getZapLevel(level string) zapcore.Level {
	switch level {
	case "Info":
		return zapcore.InfoLevel
	case "Warn":
		return zapcore.WarnLevel
	case "Debug":
		return zapcore.DebugLevel
	case "Error":
		return zapcore.ErrorLevel
	case "Fatal":
		return zapcore.FatalLevel
	default:
		return zapcore.InfoLevel
	}
}


func InitLogging(setting string) (*zap.Logger, error) {
	var logger *zap.Logger
	var err error

	if setting == "dev" {
		logger, err = zap.NewDevelopment()
	} else {
		logger, err = zap.NewProduction()
	}

	return logger, err
=======
	"go.uber.org/zap"
)

func InitLogging(setting string) (*zap.Logger) {
	
	logger, _ := zap.NewProduction()
	if setting == "dev" {
		logger, _ = zap.NewDevelopment()
	}

	return logger
>>>>>>> Add lnitLogging
}