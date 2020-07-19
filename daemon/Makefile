.PHONY: generate-grpc-stub
generate-grpc-stub:
	protoc --go_out=plugins=grpc,paths=source_relative:. protobuf/grpc/types/hello.proto
	protoc --go_out=plugins=grpc,paths=source_relative:. protobuf/grpc/services/hello.proto

.PHONY: hello-server
hello-server:
	go build -mod=vendor -o target/hello-server servers/grpc/main.go
	chmod a+x target/hello-server

.PHONY: clean
clean:
	rm -rf target

.PHONY: build
build: hello-server
