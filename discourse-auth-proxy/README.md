Discourse Auth Proxy
===

This package allows you to use Discourse as an SSO endpoint for an arbitrary site.

Discourse SSO is invoked prior to serving the proxied site. This allows you to reuse Discourse Auth in a site that ships with no auth.

Usage:

```
Usage of ./discourse-auth-proxy:
  -listen-url="": uri to listen on eg: localhost:2001. leave blank to set equal to proxy-url
  -origin-url="": origin to proxy eg: http://localhost:2002
  -proxy-url="": outer url of this host eg: http://secrets.example.com
  -sso-secret="": SSO secret for origin
  -sso-url="": SSO endpoint eg: http://discourse.forum.com
  -allow-all: don't restrict access to "admin" users on the SSO endpoint
  -timeout="10": Read/Write timeout
```

```
+--------+    proxy-url   +---------+    listen-url    +----------------------+
|  User  |  ============> |  Nginx  |  ==============> | discourse-auth-proxy |
+--------+                +---------+                  +----------------------+
    |                                                             |
    | sso-url                                          origin-url |
    |                                                             |
    v                                                             v
+-----------+                                          +----------------------+
| Discourse |                                          | Protected web server |
+-----------+                                          +----------------------+
```

Environment variables may be used as a substitute for command-line flags, e.g.:

``` shell
ORIGIN_URL='http://somesite.com' \
PROXY_URL='http://listen.com' \
SSO_SECRET='somesecret' \
SSO_URL='http://somediscourse.com' \
./discourse-auth-proxy
```

`-origin-url` may specify a name equipped with [RFC 2782](https://tools.ietf.org/html/rfc2782) DNS SRV records, such as `http://_foo._tcp.example.com`.  If SRV records are found in the DNS, each request is proxied to a host and port taken from these records.


Docker Image
===

You may run using docker using

```
docker run discourse/auth-proxy
```

Running will display configuration instructions
