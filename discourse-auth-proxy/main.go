package main

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"net"
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

	var listener net.Listener
	var err error

	if strings.Index(config.ListenAddr, "unix:") == 0 {
		file := strings.Replace(config.ListenAddr, "unix:", "", 1)
		if _, err = os.Stat(file); err == nil {
			os.Remove(file)
		}
		listener, err = net.Listen("unix", strings.Replace(config.ListenAddr, "unix:", "", 1))
	} else {
		listener, err = net.Listen("tcp", config.ListenAddr)
	}

	if err != nil {
		log.Fatal(err)
	}

	server := &http.Server{
		Handler:        handler,
		ReadTimeout:    config.Timeout,
		WriteTimeout:   config.Timeout,
		MaxHeaderBytes: 1 << 20,
	}

	log.Fatal(server.Serve(listener))
}

func authProxyHandler(handler http.Handler, config *Config) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
		r.Header.Set(config.UsernameHeader, username)
		r.Header.Set(config.GroupsHeader, groups)
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

		cookieData := strings.Join([]string{username[0], strings.Join(groupsArray, "|")}, ",")
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
		username = strings.Split(parsed, ",")[0]
		groups = strings.Split(parsed, ",")[1]
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
