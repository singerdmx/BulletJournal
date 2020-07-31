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

	tokenCache = lru.New(20)
	tokenMutex = &sync.Mutex{}
)

const cookieName = "__discourse_proxy"
const homePage = "/home/index.html"
const tokenPage = "/tokens/"
const tokenForCookieUrl = "/api/tokens/"

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
		log.Fatal(server.ListenAndServeTLS("/bin/bulletjournal.us.cert",
			"/bin/bulletjournal.us.key"))
	}()

	httpSrv := http.Server{
		Addr: ":80",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger.Printf("Port 80: Request %s %s", r.Host, r.URL)
			if r.Host == "home.bulletjournal.us" {
				logger.Printf("Port 80: Bypassing Auth Proxy: %s", r.RequestURI)
				proxy.ServeHTTP(w, r)
				return
			}
			http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
		}),
	}
	log.Println(httpSrv.ListenAndServe())
}

func authProxyHandler(handler http.Handler, config *Config) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Printf("Request %s %s", r.Host, r.URL)
		if r.Host == "home.bulletjournal.us" {
			logger.Printf("Port 443: Redirect to 80: %s", r.RequestURI)
			http.Redirect(w, r, "http://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
			return
		}
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

	authHeader := r.Header.Get("Authorization")
	if len(authHeader) < 6 {
		return false
	}

	if authHeader[0:6] == "Basic " {
		bCreds, _ := base64.StdEncoding.DecodeString(authHeader[6:])
		creds := string(bCreds)
		if creds == config.BasicAuth {
			colonIdx := strings.Index(creds, ":")
			if colonIdx == -1 {
				return false
			}
			username := creds[0:colonIdx]
			r.Header.Set(config.UsernameHeader, username)
			r.Header.Del("Authorization")
			handler.ServeHTTP(w, r)
			return true
		} else {
			logger.Printf("rejected basic auth creds: authorization header: %s", authHeader)
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

func getAuthCookie(r *http.Request, w http.ResponseWriter) (string, string, string, error) {
	cookie, err := r.Cookie(cookieName)
	if err != nil {
		return "", "", "", err
	}
	if cookie == nil {
		return "", "", "", fmt.Errorf("missing cookie")
	}
	username, groups, err := parseCookie(cookie.Value, config.CookieSecret)
	if err != nil {
		logger.Printf("parseCookie err: %v", err)
		deleteCookie(w)
	}
	return username, groups, cookie.Value, err
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

	if strings.HasPrefix(r.RequestURI, tokenForCookieUrl) {
		returnToken := getApiToken(r)
		fmt.Fprintf(w, "%v", returnToken)
		return
	}

	if shouldByPass(r) {
		logger.Printf("Bypassing Auth Proxy: %s", r.RequestURI)
		handler.ServeHTTP(w, r)
		return
	}
	
	if isMobile(r) {
		processMobileRequest(handler, r, w, fail, writeHttpError)
		return
	}

	username, groups, _, err := getAuthCookie(r, w)
	if err != nil { // No Cookie
		query := r.URL.Query()
		sso := query.Get("sso")
		sig := query.Get("sig")

		if len(sso) == 0 {
			redirectToSSO(r, w)
			return
		}
		handleSSOReturn(sso, fail, r, w, writeHttpError, sig)
		return
	}

	forwardToNginx(handler, r, w, username, groups)
	return
}

func forwardToNginx(handler http.Handler, r *http.Request, w http.ResponseWriter, username string, groups string) {
	logger.Printf("%s %s, %s", r.Header.Get("request-id"), username, r.RequestURI)
	r.Header.Set(config.UsernameHeader, username)
	r.Header.Set(config.GroupsHeader, groups)
	handler.ServeHTTP(w, r)
}

func processMobileRequest(handler http.Handler, r *http.Request, w http.ResponseWriter,
	fail func(format string, v ...interface{}),
	writeHttpError func(code int)) {

	query := r.URL.Query()
	if strings.HasPrefix(r.RequestURI, tokenPage) && len(query.Get("sso")) == 0 {
		if username, groups, cookieValue, err := getAuthCookie(r, w); err == nil {
			token := r.RequestURI[len(tokenPage) : len(tokenPage)+6]
			logger.Printf("Saving token %s", token)
			tokenMutex.Lock()
			tokenCache.Add(token, cookieValue)
			tokenMutex.Unlock()
			forwardToNginx(handler, r, w, username, groups)
		} else {
			redirectToSSO(r, w)
		}
		return
	}
	_, _, _, err := getAuthCookie(r, w)
	if err != nil { // not logged in
		sso := query.Get("sso")
		sig := query.Get("sig")

		if len(sso) == 0 {
			http.Redirect(w, r, "https://"+r.Host+homePage, 302)
			return
		}

		handleSSOReturn(sso, fail, r, w, writeHttpError, sig)
		return
	}

	// logged in
	http.Redirect(w, r, "https://"+r.Host+homePage, 302)
}

func getApiToken(r *http.Request) (returnCookie string) {
	token := r.RequestURI[len(tokenForCookieUrl) : len(tokenForCookieUrl)+6]
	tokenMutex.Lock()
	value, ok := tokenCache.Get(token)
	tokenMutex.Unlock()

	if !ok {
		logger.Printf("token not found: %s", token)
		returnCookie = ""
		return
	}

	returnCookie = value.(string)
	logger.Printf("returnCookie found: %v", returnCookie)
	tokenMutex.Lock()
	tokenCache.Remove(token)
	tokenMutex.Unlock()
	return
}

func redirectToSSO(r *http.Request, w http.ResponseWriter) {
	logger.Printf("Redirect %s to sso_provider", r.URL)
	ssoURL := config.SSOURLString + "/session/sso_provider?" + ssoPayload(config.SSOSecret, config.ProxyURLString, r.URL.String())
	deleteCookie(w)
	http.Redirect(w, r, ssoURL, 302)
}

func shouldByPass(r *http.Request) bool {
	if strings.HasPrefix(r.RequestURI, "/api/public/items/NOTE") ||
			strings.HasPrefix(r.RequestURI, "/api/public/items/TASK") {
		return false
	}
	return r.Host == "home.bulletjournal.us" ||
		strings.HasPrefix(r.RequestURI, "/home") ||
		strings.HasPrefix(r.RequestURI, "/api/public/") ||
		strings.HasPrefix(r.RequestURI, "/public/") ||
		strings.HasPrefix(r.RequestURI, "/api/calendar/google/oauth2_basic/callback") ||
		strings.HasPrefix(r.RequestURI, "/api/calendar/google/channel/notifications") ||
		strings.HasSuffix(r.RequestURI, "/manifest.json") ||
		strings.HasSuffix(r.RequestURI, ".ico")
}

func handleSSOReturn(sso string, fail func(format string, v ...interface{}),
	r *http.Request, w http.ResponseWriter, writeHttpError func(code int), sig string) {
	decoded, err := base64.StdEncoding.DecodeString(sso)
	if err != nil {
		fail("invalid sso query parameter: %s", err)
		deleteCookie(w)
		return
	}

	parsedQuery, err := url.ParseQuery(string(decoded))
	if err != nil {
		fail("invalid sso query parameter: %s", err)
		deleteCookie(w)
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
		deleteCookie(w)
		return
	}
	if len(username) == 0 {
		fail("incomplete payload from sso provider: missing username")
		deleteCookie(w)
		return
	}
	if len(admin) == 0 {
		fail("incomplete payload from sso provider: missing admin")
		deleteCookie(w)
		return
	}
	if !(config.AllowAll || admin[0] == "true") {
		writeHttpError(http.StatusForbidden)
		deleteCookie(w)
		return
	}

	returnUrl, err := getReturnUrl(config.SSOSecret, sso, sig, nonce[0])
	if err != nil {
		fail("failed to build return URL: %s", err)
		deleteCookie(w)
		return
	}

	// we have a valid auth
	expiration := time.Now().Add(365 * 24 * time.Hour)

	cookieData := url.QueryEscape(username[0]) + "##" + url.QueryEscape(strings.Join(groupsArray, "|"))
	cookieValue := signCookie(cookieData, config.CookieSecret)
	cookie := http.Cookie{Name: cookieName, Value: cookieValue, Expires: expiration, Path: "/"}
	http.SetCookie(w, &cookie)

	if isMobile(r) && strings.HasPrefix(returnUrl, tokenPage) {
		token := strings.TrimPrefix(returnUrl, tokenPage)
		logger.Printf("Saving token %s", token)
		tokenMutex.Lock()
		tokenCache.Add(token, cookieValue)
		tokenMutex.Unlock()
	}

	// works around weird safari stuff
	fmt.Fprintf(w, "<html><head></head><body><script>window.location = '%v'</script></body>", returnUrl)
}

func isMobile(r *http.Request) bool {
	header := strings.ToLower(r.Header.Get("User-Agent"))
	logger.Printf("User-Agent: %s", header)
	if strings.Contains(header, "ipad") {
		return false
	}
	return strings.Contains(header, "mobile")
}

func deleteCookie(w http.ResponseWriter) {
	c := &http.Cookie{
		Name:    cookieName,
		Value:   "",
		Path:    "/",
		Expires: time.Unix(0, 0),
	}

	http.SetCookie(w, c)
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
	return data + "##" + computeHMAC(data, secret)
}

func parseCookie(data, secret string) (username string, groups string, err error) {
	err = nil
	username = ""
	groups = ""
	split := strings.Split(data, "##")

	if len(split) < 2 {
		err = fmt.Errorf("Expecting a semi column in cookie")
		return
	}

	signature := split[len(split)-1]
	parsed := strings.Join(split[:len(split)-1], "##")
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

func ssoPayload(secret string, returnSsoUrl string, returnUrl string) string {
	result := "return_sso_url=" + returnSsoUrl + returnUrl + "&nonce=" + addNonce(returnUrl)
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
