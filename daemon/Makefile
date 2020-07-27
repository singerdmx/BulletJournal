GOOS ?= darwin
GOARCH ?= amd64
TARGET ?= target

.PHONY: generate-grpc-stub
generate-grpc-stub:
	protoc --go_out=plugins=grpc,paths=source_relative:. protobuf/grpc/types/hello.proto
	protoc --go_out=plugins=grpc,paths=source_relative:. protobuf/grpc/services/hello.proto

.PHONY: hello-server
hello-server:
	GOOS=${GOOS} GOARCH=${GOARCH} go build -mod=vendor -o ${TARGET}/hello-server servers/grpc/main.go
	chmod a+x ${TARGET}/hello-server

.PHONY: clean
clean:
	rm -rf ${TARGET}

.PHONY: build
build: hello-server
