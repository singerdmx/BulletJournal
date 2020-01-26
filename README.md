<a href="https://1o24bbs.com/"><img src=
"https://user-images.githubusercontent.com/122956/72955931-ccc07900-3d52-11ea-89b1-d468a6e2aa2b.png"
 width="150px" height="150px"></a>

<b>BulletJournal</b> is an open source platform for notebook keeping, task/project management and coordination with speciality in personal organization, scheduling, reminders, to-do lists, notes sharing and team project collaboration.

## Installation
- Docker

### Pre-requisite (Docker)
- Docker 19.03.5+
- Postgres 9.4+
- Docker Compose 1.25+ (optional but recommended)

## Quick Start
Please open the terminal and execute the command below. Make sure you have installed docker-compose in advance.
```bash
git clone https://github.com/singerdmx/BulletJournal.git
cd BulletJournal
chmod +x start.sh

```

Next, you can look into the `docker-compose.yml` (with detailed config params)
Then execute the command below, and SpringBoot + Postgres will start up. 
Open the browser and enter `http://localhost:8080/swagger-ui.html` to see the UI interface.
```bash
./start.sh
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

