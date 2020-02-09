cd ./discourse-auth-proxy
docker build -t mwangxx/auth-proxy .
cd ..

cd ./frontend
docker build -t mwangxx/bulletjournal-frontend .
cd ..

cd ./backend
docker build -f DockerfileWin -t mwangxx/bulletjournal-backend .
cd ..
