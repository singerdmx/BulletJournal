# Protobuf definition

Run the following to install protobuf and protoc-gen-go
```
brew install protobuf
go get -u github.com/golang/protobuf/protoc-gen-go
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
