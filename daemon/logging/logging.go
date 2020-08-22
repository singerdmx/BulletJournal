package logging

import (
	"errors"
	"log"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

var logger Logger

func GetLogger() *Logger {
	if logger == nil {
		log.Fatal("Logger is not initialized")
		return nil
	}
	return &logger
}

func GetLoggerConfig(EnableConsole bool,
	ConsoleLevel string,
	ConsoleJSONFormat bool,
	EnableFile bool,
	FileLevel string,
	FileJSONFormat bool,
	FileLocation string) Configuration {
	return Configuration{
		EnableConsole:     EnableConsole,
		ConsoleLevel:      ConsoleLevel,
		ConsoleJSONFormat: ConsoleJSONFormat,
		EnableFile:        EnableFile,
		FileLevel:         FileLevel,
		FileJSONFormat:    FileJSONFormat,
		FileLocation:      FileLocation,
	}
}

func InitLogging(env *string) {
	var config Configuration
	if *env == "prod" {
		config = GetLoggerConfig(true, INFO, true, true, INFO, true, "../tmp/daemon-prod.log")
	} else {
		config = GetLoggerConfig(true, DEBUG, true, true, INFO, true, "../tmp/daemon-dev.log")
	}

	err := InitializeLogger(config, InstanceZapLogger)

	if err != nil {
		log.Fatalf("Could not instantiate log %s", err.Error())
	}
}

//Fields Type to pass when we want to call WithFields for structured logging
type Fields map[string]interface{}

const (
	//Debug has verbose message
	DEBUG = "debug"
	//Info is default log level
	INFO = "info"
	//Warn is for logging messages about possible issues
	WARN = "warn"
	//Error is for logging errors
	ERROR = "error"
	//Fatal is for logging fatal messages. The sytem shutsdown after logging the message.
	FATAL = "fatal"
)

const (
	//InstanceZapLogger will be used to create Zap instance for the logger
	InstanceZapLogger int = iota
)

var (
	errInvalidLoggerInstance = errors.New("Invalid logger instance")
)

//Logger is our contract for the logger
type Logger interface {
	Debug(v ...interface{})

	Info(v ...interface{})

	Warn(v ...interface{})

	Error(v ...interface{})

	Fatal(v ...interface{})

	Panic(v ...interface{})

	Debugf(format string, args ...interface{})

	Infof(format string, args ...interface{})

	Warnf(format string, args ...interface{})

	Errorf(format string, args ...interface{})

	Fatalf(format string, args ...interface{})

	Panicf(format string, args ...interface{})

	WithFields(keyValues Fields) Logger
}

// Configuration stores the config for the Logger
// For some loggers there can only be one level across writers, for such the level of Console is picked by default
type Configuration struct {
	EnableConsole     bool
	ConsoleJSONFormat bool
	ConsoleLevel      string
	EnableFile        bool
	FileJSONFormat    bool
	FileLevel         string
	FileLocation      string
}

func InitializeLogger(config Configuration, loggerInstance int) error {
	if loggerInstance == InstanceZapLogger {
		zapLogger, err := newZapLogger(config)
		if err != nil {
			return err
		}
		logger = zapLogger
		return nil
	}
	return errInvalidLoggerInstance
}

func Debug(v ...interface{}) {
	logger.Debug(v)
}

func Println(v ...interface{}) {
	logger.Info(v)
}

func Info(v ...interface{}) {
	logger.Info(v)
}

func Warn(v ...interface{}) {
	logger.Warn(v)
}

func Error(v ...interface{}) {
	logger.Error(v)
}

func Fatal(v ...interface{}) {
	logger.Fatal(v)
}

func Panic(v ...interface{}) {
	logger.Panic(v)
}

func Debugf(format string, args ...interface{}) {
	logger.Debugf(format, args...)
}

func Printf(format string, args ...interface{}) {
	logger.Infof(format, args...)
}

func Infof(format string, args ...interface{}) {
	logger.Infof(format, args...)
}

func Warnf(format string, args ...interface{}) {
	logger.Warnf(format, args...)
}

func Errorf(format string, args ...interface{}) {
	logger.Errorf(format, args...)
}

func Fatalf(format string, args ...interface{}) {
	logger.Fatalf(format, args...)
}

func Panicf(format string, args ...interface{}) {
	logger.Panicf(format, args...)
}

func WithFields(keyValues Fields) Logger {
	return logger.WithFields(keyValues)
}

type zapLogger struct {
	sugaredLogger *zap.SugaredLogger
}

func getEncoder(isJSON bool) zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.TimeKey = "time"
	if isJSON {
		return zapcore.NewJSONEncoder(encoderConfig)
	}
	return zapcore.NewConsoleEncoder(encoderConfig)
}

func getZapLevel(level string) zapcore.Level {
	switch level {
	case INFO:
		return zapcore.InfoLevel
	case WARN:
		return zapcore.WarnLevel
	case DEBUG:
		return zapcore.DebugLevel
	case ERROR:
		return zapcore.ErrorLevel
	case FATAL:
		return zapcore.FatalLevel
	default:
		return zapcore.InfoLevel
	}
}

func newZapLogger(config Configuration) (Logger, error) {
	var cores []zapcore.Core

	if config.EnableConsole {
		level := getZapLevel(config.ConsoleLevel)
		writer := zapcore.Lock(os.Stdout)
		core := zapcore.NewCore(getEncoder(config.ConsoleJSONFormat), writer, level)
		cores = append(cores, core)
	}

	if config.EnableFile {
		level := getZapLevel(config.FileLevel)
		writer := zapcore.AddSync(&lumberjack.Logger{
			Filename: config.FileLocation,
			MaxSize:  100,
			Compress: true,
			MaxAge:   28,
		})
		core := zapcore.NewCore(getEncoder(config.FileJSONFormat), writer, level)
		cores = append(cores, core)
	}

	combinedCore := zapcore.NewTee(cores...)

	logger := zap.New(combinedCore,
		zap.AddCallerSkip(2),
		zap.AddCaller(),
	).Sugar()

	return &zapLogger{
		sugaredLogger: logger,
	}, nil
}

func (l *zapLogger) Debug(v ...interface{}) {
	l.sugaredLogger.Debug(v)
}

func (l *zapLogger) Info(v ...interface{}) {
	l.sugaredLogger.Info(v)
}

func (l *zapLogger) Warn(v ...interface{}) {
	l.sugaredLogger.Warn(v)
}

func (l *zapLogger) Error(v ...interface{}) {
	l.sugaredLogger.Error(v)
}

func (l *zapLogger) Fatal(v ...interface{}) {
	l.sugaredLogger.Fatal(v)
}

func (l *zapLogger) Panic(v ...interface{}) {
	l.sugaredLogger.Panic(v)
}

func (l *zapLogger) Debugf(format string, args ...interface{}) {
	l.sugaredLogger.Debugf(format, args...)
}

func (l *zapLogger) Infof(format string, args ...interface{}) {
	l.sugaredLogger.Infof(format, args...)
}

func (l *zapLogger) Warnf(format string, args ...interface{}) {
	l.sugaredLogger.Warnf(format, args...)
}

func (l *zapLogger) Errorf(format string, args ...interface{}) {
	l.sugaredLogger.Errorf(format, args...)
}

func (l *zapLogger) Fatalf(format string, args ...interface{}) {
	l.sugaredLogger.Fatalf(format, args...)
}

func (l *zapLogger) Panicf(format string, args ...interface{}) {
	l.sugaredLogger.Fatalf(format, args...)
}

func (l *zapLogger) WithFields(fields Fields) Logger {
	var f = make([]interface{}, 0)
	for k, v := range fields {
		f = append(f, k)
		f = append(f, v)
	}
	newLogger := l.sugaredLogger.With(f...)
	return &zapLogger{newLogger}
}
