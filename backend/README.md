How to build and push the backend image
```
DOCKER_BUILDKIT=1 docker build -t {dockerhub_name}/{image_name} .
```

e.g.
```
DOCKER_BUILDKIT=1 docker build -t mwangxx/bulletjournal-backend .
docker push mwangxx/bulletjournal-backend:latest
```