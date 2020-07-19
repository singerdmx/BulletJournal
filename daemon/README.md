# GRPC Go daemon

Run the following to initialize the project
```
brew install go
brew install protobuf
go get -u github.com/golang/protobuf/protoc-gen-go

git clone https://github.com/singerdmx/BulletJournal.git
cd <PATH to BulletJournal>/daemon
go mod init github.com/BulletJournal/daemon
go mod vendor
```

If needed, pull dependencies that are updated in your go code
```
go mod vendor
```

Build grpc server written in go code
```
make clean build
```

Run grpc server in foreground
```
target/hello-server
```

Run rpc call to test grpc server
```
Right click and run daemon/clients/grpc/main.go
```

Kill grpc server
```
control+c
```