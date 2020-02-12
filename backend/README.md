## How to run Spring Boot App locally

Make sure port 8080 is available and then start backend by running the following command:
```
./gradlew bootRun
```
How to build and push the backend image
```
DOCKER_BUILDKIT=1 docker build -t {dockerhub_name}/{image_name} .
```

e.g.
```
DOCKER_BUILDKIT=1 docker build -t mwangxx/bulletjournal-backend .
docker push mwangxx/bulletjournal-backend:latest
```

Note: bring up redis container in order for tests to pass.