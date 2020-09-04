# Online Deployment Setup

For online deployment, Spring Profiles is set to "prod".

Run the following command to bring up all containers using online deployment configuration and setup.

```bash
../start.sh
```

## How to Release

1. Update source code on local git repo: Change version number in docker-compose.yml
2. Push to Github
2. Run the following command on Production Server
```
cd /root/ws/BulletJournal/deployment
./start.sh
```
3. On Production Server, verify using `docker ps` and UI

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

## Database Backup Restore

To create a backup for the current db status, run "db_backup.sh", it will create a backup file named as `db_yyyy-mm-dd-hh:mm:ss.gz` at path `/var/db_backup` directory in db docker container. 

To restore from a database backup:
```sh
docker exec $(sudo docker ps -aqf "name=db") psql -U postgres -c "DROP SCHEMA public,template CASCADE;"
docker exec $(sudo docker ps -aqf "name=db") psql -U postgres -c "CREATE SCHEMA public;"
docker exec $(sudo docker ps -aqf "name=db") psql -U postgres -c "CREATE SCHEMA template;"
docker exec $(sudo docker ps -aqf "name=db") sh -c "gunzip -c /var/db_backup/ReplaceWithBackupFileName | psql  --dbname=postgresql://postgres:docker@localhost:5432/postgres"
```


## Database Migration (FlywayDB Migrate)

Migration script are just sql files with prefix name "V1, V2, V3 ...", location is "//BulletJournal/backend/src/main/resources/db/migration".

1. Install flyway cli first: [doc link](https://flywaydb.org/getstarted/firststeps/commandline);

2. If it's the first time to set up flyway, run following command to initialize, note that this will clear all tables and schema in db:
   ```bash
    flyway -url=jdbc:postgresql://localhost:5432/postgres -schemas=public,template -user=postgres -password=docker -locations=filesystem:{path to migration folder} clean
   ```
   After this step, **Do not** manually do anything like `DROP SCHEMA public CASCADE;` in psql cli.

3. Start backend app normally.

* ### Trouble Shooting:
  1. Use following command to check migration status:
     ```bash
      flyway -url=jdbc:postgresql://localhost:5432/postgres -schemas=public,template -user=postgres -password=docker -locations=filesystem:{path to migration folder} info
     ```
  2. Fail to start because error when executing "data.sql"
     This is because the seed data in "data.sql" were already there when you start backend. Solution is before starting DB, run above "clean" command first to reset db or manually delete all data in each table.
