cd ./auth-proxy
docker build -t mwangxx/auth-proxy .
cd ..

cd ./frontend
docker build -t mwangxx/bulletjournal-frontend .
cd ..

cd ./backend
cp -R ../protobuf ./
DOCKER_BUILDKIT=1 docker build -t mwangxx/bulletjournal-backend .
cd ..
