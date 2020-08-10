# GRPC Go daemon

Run the following to initialize the project
```
brew install go

git clone https://github.com/singerdmx/BulletJournal.git
cd <PATH to BulletJournal>/daemon
go mod init github.com/BulletJournal/daemon
go mod vendor
```

If needed, please pull dependencies that are updated in your go code
```
go mod vendor
```

Build grpc server written in go code for macOS
```
make clean build
```

Run grpc server in foreground
```
target/daemon-server
```

Run rpc call against daemon server for resting its rpc endpoint
```
Right click and run daemon/clients/grpc/main.go
```

Run http call against daemon server for resting its rest endpoint
```
Right click and run daemon/clients/rest/curl.sh
```

Kill grpc server
```
control+c
```

Build grpc server in bin directory for linux platform
```
make clean build GOOS=linux TARGET=bin
```

## Docker usage
Run the following commands to build Docker image after code changes are committed:
```
docker build --rm -t bulletjournal-daemon:latest .
```
Bring up the image by running:
```
docker run -it bulletjournal-daemon
```
Then push Docker image to Docker hub:
```
docker tag bulletjournal-daemon:latest zywangzy/bulletjournal-daemon:latest
docker push zywangzy/bulletjournal-daemon
```
