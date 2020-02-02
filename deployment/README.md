# Online Deployment Setup

For online deployment, Spring Profiles is set to "prod".

Run the following command to bring up all containers using online deployment configuration and setup.

```bash
../start.sh
```

## Frontend Image

Go to `frontend` folder and run the following commands.
```bash
# docker build -t {dockerhub_name}/{image_name} .

docker build -t xcode1024/bulletjournal-frontend .
docker push xcode1024/bulletjournal-frontend
```

## Authentication

<b>BulletJournal</b> uses Discourse as an SSO endpoint for authentication based on [Discourse Auth Proxy](https://github.com/discourse/discourse-auth-proxy).

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

The image of auth-proxy is from [Discourse Auth Proxy](https://github.com/discourse/discourse-auth-proxy). The following commands show how you can build the image.
```bash
# docker build -t {dockerhub_name}/{image_name} .

docker build -t xcode1024/auth-proxy .
docker push xcode1024/auth-proxy
```

## Architecture

<b>BulletJournal</b> adopts THREE TIER ARCHITECTURE using React (Presentation Layer, a.k.a static files) + Spring Boot (Application Layer, a.k.a controller) + PostgreSQL (Persistence Layer, a.k.a database).

```
+--------+    proxy-url   +---------+    listen-url    +----------------------+
|  User  |  ============> |  Nginx  |  ==============> | discourse-auth-proxy |
+--------+                +---------+                  +----------------------+
    |                                                             |
    | sso-url                                          origin-url |
    |                                                             |
    v                                                             v
+-----------+                                          +----------------------+
| Discourse |                                          |     static assets    |
+-----------+                                          +----------------------+
                                                                  |
                                                                  |
                                                                  v
                                                       +----------------------+
                                                       |      Spring Boot     |
                                                       +----------------------+
                                                                  |
                                                                  |
                                                                  v
                                                       +----------------------+
                                                       |      PostgreSQL      |
                                                       +----------------------+
```