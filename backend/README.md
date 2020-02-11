## How to run Spring Boot App locally

Make sure port 8080 is available and then start backend by running the following command:
```
./gradlew bootRun
```
How to build and push the backend image
```
docker build -t {dockerhub_name}/{image_name} .
```

e.g.
```
docker build -t mwangxx/bulletjournal-backend .
docker push mwangxx/bulletjournal-backend:latest
```