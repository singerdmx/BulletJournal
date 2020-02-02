package main

import (
	"io"
	"log"
	"net/http"
	"time"

	"golang.org/x/time/rate"
)

type rateLimitedLogger struct {
	logger  *log.Logger
	limiter *rate.Limiter
}

func newRateLimitedLogger(out io.Writer, prefix string, flag int) *rateLimitedLogger {
	return &rateLimitedLogger{
		logger:  log.New(out, prefix, flag),
		limiter: rate.NewLimiter(rate.Every(250*time.Millisecond), 30),
	}
}

func (l *rateLimitedLogger) Printf(format string, v ...interface{}) {
	if !l.limiter.Allow() {
		return
	}
	l.logger.Printf(format, v...)
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
		log.Printf("%s %s %s %d", r.RemoteAddr, r.Method, r.URL, lw.StatusCode)
	})
}
