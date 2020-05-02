package main

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"crypto/tls"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang/groupcache/lru"
	"github.com/pborman/uuid"

	"github.com/discourse/discourse-auth-proxy/internal/httpproxy"
)

var (
	logger = newRateLimitedLogger(os.Stderr, "", 0)

	config *Config

	nonceCache = lru.New(20)
	nonceMutex = &sync.Mutex{}
)

func main() {
	{
		var err error
		config, err = ParseConfig()
		if err != nil {
			usage(err)
		}
	}

	dnssrv := httpproxy.NewDNSSRVBackend(config.OriginURL)
	go dnssrv.Lookup(context.Background(), 50*time.Second, 10*time.Second, config.SRVAbandonAfter)
	proxy := &httputil.ReverseProxy{Director: dnssrv.Director}

	handler := authProxyHandler(proxy, config)

	if config.LogRequests {
		handler = logHandler(handler)
	}

	cfg := &tls.Config{
		MinVersion:               tls.VersionTLS12,
		CurvePreferences:         []tls.CurveID{tls.CurveP521, tls.CurveP384, tls.CurveP256},
		PreferServerCipherSuites: true,
		CipherSuites: []uint16{
			tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
			tls.TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,
			tls.TLS_RSA_WITH_AES_256_GCM_SHA384,
			tls.TLS_RSA_WITH_AES_256_CBC_SHA,
		},
	}

	server := &http.Server{
		Addr:           ":443",
		Handler:        handler,
		ReadTimeout:    config.Timeout,
		WriteTimeout:   config.Timeout,
		TLSConfig:      cfg,
		MaxHeaderBytes: 1 << 20,
		TLSNextProto:   make(map[string]func(*http.Server, *tls.Conn, http.Handler), 0),
	}

	go func() {
		log.Fatal(server.ListenAndServeTLS("/bin/localhost.cert",
			"/bin/localhost.key"))
	}()

	httpSrv := http.Server{
		Addr: ":80",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
		}),
	}
	log.Println(httpSrv.ListenAndServe())
}

func authProxyHandler(handler http.Handler, config *Config) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Printf("Request %s", r.RequestURI)
		if checkWhitelist(handler, r, w) {
			return
		}
		if checkAuthorizationHeader(handler, r, w) {
			return
		}
		redirectIfNoCookie(handler, r, w)
	})
}

func checkAuthorizationHeader(handler http.Handler, r *http.Request, w http.ResponseWriter) bool {
	if config.BasicAuth == "" {
		return false
	}

	auth_header := r.Header.Get("Authorization")
	if len(auth_header) < 6 {
		return false
	}

	if auth_header[0:6] == "Basic " {
		b_creds, _ := base64.StdEncoding.DecodeString(auth_header[6:])
		creds := string(b_creds)
		if creds == config.BasicAuth {
			colon_idx := strings.Index(creds, ":")
			if colon_idx == -1 {
				return false
			}
			username := creds[0:colon_idx]
			r.Header.Set(config.UsernameHeader, username)
			r.Header.Del("Authorization")
			handler.ServeHTTP(w, r)
			return true
		} else {
			logger.Printf("rejected basic auth creds: authorization header: %s", auth_header)
		}
	}

	return false
}

func checkWhitelist(handler http.Handler, r *http.Request, w http.ResponseWriter) bool {
	if config.Whitelist == "" {
		return false
	}

	if r.URL.Path == config.Whitelist {
		handler.ServeHTTP(w, r)
		return true
	}

	return false
}

func redirectIfNoCookie(handler http.Handler, r *http.Request, w http.ResponseWriter) {
	writeHttpError := func(code int) {
		http.Error(w, http.StatusText(code), code)
	}
	writeClientError := func() {
		writeHttpError(http.StatusBadRequest)
	}
	fail := func(format string, v ...interface{}) {
		logger.Printf(format, v...)
		writeClientError()
	}

	cookie, err := r.Cookie("__discourse_proxy")
	var username, groups string

	if err == nil && cookie != nil {
		username, groups, err = parseCookie(cookie.Value, config.CookieSecret)
	}

	if err == nil {
		logger.Printf("%s %s, %s", r.Header.Get("request-id"), username, r.RequestURI)
		r.Header.Set(config.UsernameHeader, username)
		r.Header.Set(config.GroupsHeader, groups)
		handler.ServeHTTP(w, r)
		return
	}

	if (strings.HasPrefix(r.RequestURI, "/api/public/items/") ||
		strings.HasPrefix(r.RequestURI, "/public/items/") ||
		strings.HasPrefix(r.RequestURI, "/api/calendar/google/oauth2_basic/callback") ||
		strings.HasPrefix(r.RequestURI, "/api/calendar/google/channel/notifications")) {
		logger.Printf("Bypassing Auth Proxy: %s", r.RequestURI)
		handler.ServeHTTP(w, r)
		return
	}

	query := r.URL.Query()
	sso := query.Get("sso")
	sig := query.Get("sig")

	if len(sso) == 0 {
		url := config.SSOURLString + "/session/sso_provider?" + sso_payload(config.SSOSecret, config.ProxyURLString, r.URL.String())
		http.Redirect(w, r, url, 302)
	} else {
		decoded, err := base64.StdEncoding.DecodeString(sso)
		if err != nil {
			fail("invalid sso query parameter: %s", err)
			return
		}

		parsedQuery, err := url.ParseQuery(string(decoded))
		if err != nil {
			fail("invalid sso query parameter: %s", err)
			return
		}

		var (
			username    = parsedQuery["username"]
			groups      = parsedQuery["groups"]
			admin       = parsedQuery["admin"]
			nonce       = parsedQuery["nonce"]
			groupsArray = strings.Split(groups[0], ",")
		)

		if len(nonce) == 0 {
			fail("incomplete payload from sso provider: missing nonce")
			return
		}
		if len(username) == 0 {
			fail("incomplete payload from sso provider: missing username")
			return
		}
		if len(admin) == 0 {
			fail("incomplete payload from sso provider: missing admin")
			return
		}
		if !(config.AllowAll || admin[0] == "true") {
			writeHttpError(http.StatusForbidden)
			return
		}

		returnUrl, err := getReturnUrl(config.SSOSecret, sso, sig, nonce[0])
		if err != nil {
			fail("failed to build return URL: %s", err)
			return
		}

		// we have a valid auth
		expiration := time.Now().Add(365 * 24 * time.Hour)

		cookieData := url.QueryEscape(username[0]) + "," + url.QueryEscape(strings.Join(groupsArray, "|"))
		cookie := http.Cookie{Name: "__discourse_proxy", Value: signCookie(cookieData, config.CookieSecret), Expires: expiration, HttpOnly: true, Path: "/"}
		http.SetCookie(w, &cookie)

		// works around weird safari stuff
		fmt.Fprintf(w, "<html><head></head><body><script>window.location = '%v'</script></body>", returnUrl)
	}
}

func getReturnUrl(secret string, payload string, sig string, nonce string) (returnUrl string, err error) {
	nonceMutex.Lock()
	value, ok := nonceCache.Get(nonce)
	nonceMutex.Unlock()
	if !ok {
		err = fmt.Errorf("nonce not found: %s", nonce)
		return
	}

	returnUrl = value.(string)
	nonceMutex.Lock()
	nonceCache.Remove(nonce)
	nonceMutex.Unlock()

	if computeHMAC(payload, secret) != sig {
		err = errors.New("signature is invalid")
	}
	return
}

func sameHost(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Host = r.URL.Host
		handler.ServeHTTP(w, r)
	})
}

func signCookie(data, secret string) string {
	return data + "," + computeHMAC(data, secret)
}

func parseCookie(data, secret string) (username string, groups string, err error) {
	err = nil
	username = ""
	groups = ""
	split := strings.Split(data, ",")

	if len(split) < 2 {
		err = fmt.Errorf("Expecting a semi column in cookie")
		return
	}

	signature := split[len(split)-1]
	parsed := strings.Join(split[:len(split)-1], ",")
	expected := computeHMAC(parsed, secret)

	if expected != signature {
		parsed = ""
		err = fmt.Errorf("Expecting signature to match")
		return
	} else {
		username = split[0]
		groups = split[1]
	}

	return
}

func sso_payload(secret string, return_sso_url string, returnUrl string) string {
	result := "return_sso_url=" + return_sso_url + returnUrl + "&nonce=" + addNonce(returnUrl)
	payload := base64.StdEncoding.EncodeToString([]byte(result))

	return "sso=" + payload + "&sig=" + computeHMAC(payload, secret)
}

func addNonce(returnUrl string) string {
	guid := uuid.New()
	nonceMutex.Lock()
	nonceCache.Add(guid, returnUrl)
	nonceMutex.Unlock()
	return guid
}

func computeHMAC(message string, secret string) string {
	key := []byte(secret)
	h := hmac.New(sha256.New, key)
	h.Write([]byte(message))
	return hex.EncodeToString(h.Sum(nil))
}
