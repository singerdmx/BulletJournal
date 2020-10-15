# Protobuf definition

Before you go, remember to set your `GOPATH, GOROOT, GOBIN` correctly, and add them into your `PATH` variable. Based on different OS, you might need to following the instruction online. Here is an example: [https://stackoverflow.com/a/61082200/10837458](https://stackoverflow.com/a/61082200/10837458)

Run the following to install protobuf and protoc-gen-go
```
brew install protobuf
cd //BulletJournal/protobuf/daemon
go get -u github.com/golang/protobuf/protoc-gen-go
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
```

## This part will be called by daemon Makefile
**Usually you don't need to run this part manually.**

Generate/update daemon grpc server go code should you updated its proto files
```
git clone https://github.com/singerdmx/BulletJournal.git
cd <PATH to BulletJournal>/protobuf
make daemon-grpc-stub
```

Optional, pull dependencies to its local vendor used by daemon module
```
cd <PATH to BulletJournal>/protobuf/daemon
go mod vendor
```
