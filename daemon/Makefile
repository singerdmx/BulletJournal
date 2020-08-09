GOOS ?= darwin
GOARCH ?= amd64
TARGET ?= target

# .PHONY: generate-grpc-stub
# generate-grpc-stub:
# 	protoc --go_out=plugins=grpc,paths=source_relative:. protobuf/grpc/types/join_group_events.proto
# 	protoc -I. -I=third_party/googleapis --grpc-gateway_out=logtostderr=true,paths=source_relative:. --swagger_out=logtostderr=true:. --go_out=plugins=grpc,paths=source_relative:. protobuf/grpc/services/daemon.proto
# 	protoc --go_out=plugins=grpc,paths=source_relative:. protobuf/grpc/services/daemon.proto

.PHONY: daemon-server
daemon-server:
	GOOS=${GOOS} GOARCH=${GOARCH} go build -mod=vendor -o ${TARGET}/daemon-server servers/main.go
	chmod a+x ${TARGET}/daemon-server

.PHONY: clean
clean:
	rm -rf ${TARGET}

.PHONY: build
build: daemon-server
