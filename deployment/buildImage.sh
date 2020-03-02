# cd ../discourse-auth-proxy
# docker build -t xcode1024/auth-proxy .
cd ..

cd ./frontend
docker build -t xcode1024/bulletjournal-frontend .
cd ..

cd ./backend
DOCKER_BUILDKIT=1 docker build -t xcode1024/bulletjournal-backend .
cd ../deployment

# docker push xcode1024/auth-proxy:latest
# docker push xcode1024/bulletjournal-frontend:latest
# docker push xcode1024/bulletjournal-backend:latest
