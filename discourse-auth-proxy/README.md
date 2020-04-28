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

SSL Certificate Renewal
===

1. Stop auth-proxy container
2. Run `sudo certbot certonly --standalone` (TODO: try `certbot renew`) 
3. Copy the pem files to local machine `scp root@198.199.76.77:/etc/letsencrypt/live/bulletjournal.us-0001/* .`
4. Rename `cert.pem` to `bulletjournal.us.cert` and `privkey.pem` to `bulletjournal.us.key`
5. Update `discourse-auth-proxy/start.sh` for sso-secret
6. Upgrade image by running `docker build -t xcode1024/auth-proxy:[version] .`

The output of step 2 is as follows:
```
Saving debug log to /var/log/letsencrypt/letsencrypt.log

Plugins selected: Authenticator standalone, Installer None

Please enter in your domain name(s) (comma and/or space separated)  (Enter 'c'

to cancel): bulletjournal.us

Cert not yet due for renewal



You have an existing certificate that has exactly the same domains or certificate name you requested and isn't close to expiry.

(ref: /etc/letsencrypt/renewal/bulletjournal.us-0001.conf)



What would you like to do?

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

1: Keep the existing certificate for now

2: Renew & replace the cert (limit ~5 per 7 days)

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2

Renewing an existing certificate



IMPORTANT NOTES:

 - Congratulations! Your certificate and chain have been saved at:

   /etc/letsencrypt/live/bulletjournal.us-0001/fullchain.pem

   Your key file has been saved at:

   /etc/letsencrypt/live/bulletjournal.us-0001/privkey.pem

   Your cert will expire on 2020-07-27. To obtain a new or tweaked

   version of this certificate in the future, simply run certbot

   again. To non-interactively renew *all* of your certificates, run

   "certbot renew"

 - If you like Certbot, please consider supporting our work by:



   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate

   Donating to EFF:                    https://eff.org/donate-le
```