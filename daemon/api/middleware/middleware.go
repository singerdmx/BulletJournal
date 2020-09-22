package middleware

import (
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"strings"
)

const (
	RequestIDKey string = "Request-Id"
)

// headerMatcher will get reqID from a http request and return it as a string
func IncomingHeaderMatcher(key string) (string, bool) {
	switch key {
	case RequestIDKey:
		return key, true
	default:
		return runtime.DefaultHeaderMatcher(key)
	}
}

func OutgoingHeaderMatcher(key string) (string, bool) {
	switch key {
	case strings.ToLower(RequestIDKey):
		return key, true
	default:
		return runtime.DefaultHeaderMatcher(key)
	}
}