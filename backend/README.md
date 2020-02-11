Make sure 8080 is available; then start backend
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