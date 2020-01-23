<a href="https://1o24bbs.com/"><img src=
"https://user-images.githubusercontent.com/122956/72955931-ccc07900-3d52-11ea-89b1-d468a6e2aa2b.png"
 width="150px" height="150px"></a>

<b>BulletJournal</b> is an open source platform for notebook keeping, task/project management and coordination with speciality in personal organization, scheduling, reminders, to-do lists, notes sharing and team project collaboration.

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

<b>BulletJournal</b> adopts THREE TIER ARCHITECTURE using React (Presentation Layer, a.k.a static files) + Spring Boot (Application Layer, a.k.a controller) + Postgres (Persistence Layer, a.k.a database).

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

