# Protobuf definition

Usually you don't need to manually run this make, go to `daemon/` and run `make gen_proto` instead.

Run the following to install protobuf and protoc-gen-go
```
brew install protobuf
go get -u github.com/golang/protobuf/protoc-gen-go
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
```
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
