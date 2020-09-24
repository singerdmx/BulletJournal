package logging

import (
	"context"
	"log"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

const (
	RequestIDKey string = "requestID"
	SessionIDKey string = "sessionID"
)

var logger Logger

//Fields Type to pass when we want to call WithFields for structured logging
type Fields map[string]interface{}

type Logger struct {
	sugaredLogger *zap.SugaredLogger
}

//Getter of logger instance
func GetLogger() *Logger {
	if logger.sugaredLogger == nil {
		log.Fatal("Logger is not initialized")
		return nil
	}
	return &logger
}

const (
	//Debug has verbose message
	Debug = "debug"
	//Info is default log level
	Info = "info"
	//Warn is for logging messages about possible issues
	Warn = "warn"
	//Error is for logging errors
	Error = "error"
	//Fatal is for logging fatal messages. The sytem shutsdown after logging the message.
	Fatal = "fatal"
)

// Configuration stores the config for the Logger
// For some loggers there can only be one level across writers, for such the level of Console is picked by default
type Configuration struct {
	DevEnv            bool
	EnableConsole     bool
	ConsoleJSONFormat bool
	ConsoleLevel      string
	EnableFile        bool
	FileJSONFormat    bool
	FileLevel         string
	FileLocation      string
}

func GetLoggerConfig(DevEnv bool,
	EnableConsole bool,
	ConsoleLevel string,
	ConsoleJSONFormat bool,
	EnableFile bool,
	FileLevel string,
	FileJSONFormat bool,
	FileLocation string) Configuration {
	return Configuration{
		DevEnv:            DevEnv,
		EnableConsole:     EnableConsole,
		ConsoleLevel:      ConsoleLevel,
		ConsoleJSONFormat: ConsoleJSONFormat,
		EnableFile:        EnableFile,
		FileLevel:         FileLevel,
		FileJSONFormat:    FileJSONFormat,
		FileLocation:      FileLocation,
	}
}

func InitLogging() {
	config := Configuration{
		DevEnv:            false,
		EnableConsole:     true,
		ConsoleLevel:      Info,
		ConsoleJSONFormat: true,
		EnableFile:        true,
		FileLevel:         Info,
		FileJSONFormat:    true,
		FileLocation:      "/var/log/auth-proxy.log",
	}

	err := newLogger(config)

	if err != nil {
		log.Fatalf("Could not instantiate log %s", err.Error())
	}
}

func newLogger(config Configuration) error {
	zapLogger, err := newZapLogger(config)
	if err != nil {
		return err
	}
	logger = *zapLogger
	return nil
}

func getEncoder(isDev bool, isJSON bool) zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	if isDev {
		encoderConfig = zap.NewDevelopmentEncoderConfig()
	}
	if isJSON {
		return zapcore.NewJSONEncoder(encoderConfig)
	}
	return zapcore.NewConsoleEncoder(encoderConfig)
}

func getZapLevel(level string) zapcore.Level {
	switch level {
	case Info:
		return zapcore.InfoLevel
	case Warn:
		return zapcore.WarnLevel
	case Debug:
		return zapcore.DebugLevel
	case Error:
		return zapcore.ErrorLevel
	case Fatal:
		return zapcore.FatalLevel
	default:
		return zapcore.InfoLevel
	}
}

func newZapLogger(config Configuration) (*Logger, error) {
	var cores []zapcore.Core

	if config.EnableConsole {
		level := getZapLevel(config.ConsoleLevel)
		writer := zapcore.Lock(os.Stdout)
		core := zapcore.NewCore(getEncoder(config.DevEnv, config.ConsoleJSONFormat), writer, level)
		cores = append(cores, core)
	}

	if config.EnableFile {
		level := getZapLevel(config.FileLevel)
		writer := zapcore.AddSync(&lumberjack.Logger{
			Filename:   config.FileLocation,
			MaxSize:    50,
			MaxBackups: 2,
			MaxAge:     28,
			Compress:   true,
		})
		core := zapcore.NewCore(getEncoder(config.DevEnv, config.FileJSONFormat), writer, level)
		cores = append(cores, core)
	}

	combinedCore := zapcore.NewTee(cores...)

	logger := zap.New(combinedCore,
		zap.AddCallerSkip(2),
		zap.AddCaller(),
	)
	if config.DevEnv {
		logger = logger.WithOptions(zap.Development(), zap.AddStacktrace(zapcore.WarnLevel))
	}
	zap.ReplaceGlobals(logger)

	return &Logger{
		sugaredLogger: logger.Sugar(),
	}, nil
}

func (l *Logger) Debug(v ...interface{}) {
	l.sugaredLogger.Debug(v)
}

func (l *Logger) Info(v ...interface{}) {
	l.sugaredLogger.Info(v)
}

func (l *Logger) Print(v ...interface{}) {
	l.sugaredLogger.Info(v)
}

func (l *Logger) Warn(v ...interface{}) {
	l.sugaredLogger.Warn(v)
}

func (l *Logger) Error(v ...interface{}) {
	l.sugaredLogger.Error(v)
}

func (l *Logger) Fatal(v ...interface{}) {
	l.sugaredLogger.Fatal(v)
}

func (l *Logger) Panic(v ...interface{}) {
	l.sugaredLogger.Panic(v)
}

func (l *Logger) Debugf(format string, args ...interface{}) {
	l.sugaredLogger.Debugf(format, args...)
}

func (l *Logger) Infof(format string, args ...interface{}) {
	l.sugaredLogger.Infof(format, args...)
}

func (l *Logger) Printf(format string, args ...interface{}) {
	l.sugaredLogger.Infof(format, args...)
}

func (l *Logger) Warnf(format string, args ...interface{}) {
	l.sugaredLogger.Warnf(format, args...)
}

func (l *Logger) Errorf(format string, args ...interface{}) {
	l.sugaredLogger.Errorf(format, args...)
}

func (l *Logger) Fatalf(format string, args ...interface{}) {
	l.sugaredLogger.Fatalf(format, args...)
}

func (l *Logger) Panicf(format string, args ...interface{}) {
	l.sugaredLogger.Fatalf(format, args...)
}

func (l *Logger) UnSugar() {
	l.UnSugar()
}

func (l *Logger) WithFields(fields Fields) {
	var f = make([]interface{}, 0)
	for k, v := range fields {
		f = append(f, k)
		f = append(f, v)
	}
	l.sugaredLogger = l.sugaredLogger.With(f...)
}

func (l *Logger) WithContext(ctx context.Context) {
	if ctx != nil {
		if ctxRqId, ok := ctx.Value(RequestIDKey).(string); ok {
			l.sugaredLogger = l.sugaredLogger.With(zap.String(RequestIDKey, ctxRqId))
		}
		if ctxSessionId, ok := ctx.Value(SessionIDKey).(string); ok {
			l.sugaredLogger = l.sugaredLogger.With(zap.String(SessionIDKey, ctxSessionId))
		}
	}
}
