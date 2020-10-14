## Before Submission
Run command `./gradlew build`

## How to run Spring Boot App locally

First for logging purpose create folder /var/log/bulletjournal and grant permissions
```
sudo mkdir -p /var/log/bulletjournal
sudo chmod 777 /var/log/bulletjournal
```

Make sure port 8080 is available and then start backend by running the following command:
```
./gradlew bootRun
```

## How to clean and seed database

Run `backend/seed/seed_db.sh`

## How to build and push the backend image
```
DOCKER_BUILDKIT=1 docker build -t {dockerhub_name}/{image_name} .
```

e.g.
```
DOCKER_BUILDKIT=1 docker build -t mwangxx/bulletjournal-backend .
docker push mwangxx/bulletjournal-backend:latest
```

## check style
- config location: config/checkstyle
- report location: build/reports

Note: bring up redis container in order for tests to pass.

## Upgrade Gradle

```
./gradlew wrapper --gradle-version 6.4.1
./gradlew --version
```