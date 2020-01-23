# BulletJournal
BulletJournal is an open source platform for notebook keeping, task/project management and coordination with speciality in personal organization, scheduling, reminders, to-do lists, notes sharing and team project collaboration.

## Authentication

BulletJournal uses Discourse as an SSO endpoint for authentication basing on [Discourse Auth Proxy](https://github.com/discourse/discourse-auth-proxy).

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

