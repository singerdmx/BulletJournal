package main

import (
	"net/http"
	"time"

	"github.com/singerdmx/BulletJournal/discourse-auth-proxy/logging"
	"golang.org/x/time/rate"
)

type rateLimitedLogger struct {
	logger  *logging.Logger
	limiter *rate.Limiter
}

func newRateLimitedLogger() *rateLimitedLogger {
	logging.InitLogging()
	customLogger := &rateLimitedLogger{
		logger:  logging.GetLogger(),
		limiter: rate.NewLimiter(rate.Every(250*time.Millisecond), 30),
	}

	customLogger.Print("Initialize logger for Auth Proxy")
	return customLogger
}

func (l *rateLimitedLogger) Fatalf(format string, v ...interface{}) {
	if !l.limiter.Allow() {
		return
	}
	l.logger.Fatalf(format, v...)
}

func (l *rateLimitedLogger) Fatal(format string) {
	if !l.limiter.Allow() {
		return
	}
	l.logger.Fatal(format)
}

func (l *rateLimitedLogger) Printf(format string, v ...interface{}) {
	if !l.limiter.Allow() {
		return
	}
	l.logger.Printf(format, v...)
}

func (l *rateLimitedLogger) Print(format string) {
	if !l.limiter.Allow() {
		return
	}
	l.logger.Print(format)
}

type loggableResponseWriter struct {
	StatusCode int

	next http.ResponseWriter
}

func (w *loggableResponseWriter) Header() http.Header {
	return w.next.Header()
}

func (w *loggableResponseWriter) Write(b []byte) (int, error) {
	return w.next.Write(b)
}

func (w *loggableResponseWriter) WriteHeader(statusCode int) {
	w.StatusCode = statusCode
	w.next.WriteHeader(statusCode)
}

func (w *loggableResponseWriter) Flush() {
	if flusher, ok := w.next.(http.Flusher); ok {
		flusher.Flush()
	}
}

func logHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lw := &loggableResponseWriter{next: w}
		next.ServeHTTP(lw, r)
		logger.Printf("%s %s %s %d", r.RemoteAddr, r.Method, r.URL, lw.StatusCode)
	})
}
