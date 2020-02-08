# Online Deployment Setup

For online deployment, Spring Profiles is set to "prod".

Run the following command to bring up all containers using online deployment configuration and setup.

```bash
../start.sh
```

## Authentication

<b>BulletJournal</b> uses Discourse as an SSO endpoint for authentication based on [Discourse Auth Proxy](https://github.com/discourse/discourse-auth-proxy). This repo is copied to `../discourse-auth-proxy`.

```
+--------+                 proxy-url                   +----------------------+
|  User  |  =========================================> | discourse-auth-proxy |
+--------+                listen-url                   +----------------------+
    |                                                             |
    | sso-url                                          origin-url |
    |                                                             |
    v                                                             v
+-----------+                                          +----------------------+
| Discourse |                                          | Protected web server |
+-----------+                                          +----------------------+
```

Go to `../discourse-auth-proxy` and run the following commands to build the image.
For production deployment, please update `../discourse-auth-proxy/start.sh` and replace `sso-secret` with different value.
Then use the new image for `auth-proxy` in `docker-compose.yml`.
```bash
# docker build -t {dockerhub_name}/{image_name} .

docker build -t xcode1024/auth-proxy .
docker push xcode1024/auth-proxy
```

Set environment variable `SSO_API_KEY` using [Discourse API Key](https://meta.discourse.org/t/user-api-keys-specification/48536) before running `start.sh`.

## Architecture

<b>BulletJournal</b> adopts THREE TIER ARCHITECTURE using React (Presentation Layer, a.k.a Frontend with static assets) + Spring Boot (Application Layer, a.k.a controller) + PostgreSQL (Persistence Layer, a.k.a database).

```
+--------+                 proxy-url                   +----------------------+
|  User  |  =========================================> | discourse-auth-proxy |
+--------+                listen-url                   +----------------------+
    |                                                             |
    | sso-url                                          origin-url |
    |                                                             |
    v                                                             v
+-----------+                                          +----------------------+
| Discourse |                                          |       Frontend       |
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

## Frontend Image

Go to `frontend` folder and run the following commands.
```bash
# docker build -t {dockerhub_name}/{image_name} .

docker build -t mwangxx/bulletjournal-frontend .
docker push mwangxx/bulletjournal-frontend
```