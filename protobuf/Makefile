.PHONY: daemon-grpc-stub
daemon-grpc-stub:
	protoc --go_out=plugins=grpc,paths=source_relative:. daemon/grpc/types/join_group_events.proto
	protoc --go_out=plugins=grpc,paths=source_relative:. daemon/grpc/types/subscribe_notification.proto
	protoc --go_out=plugins=grpc,paths=source_relative:. daemon/grpc/types/health.proto
	protoc -I. -I=third_party/googleapis --plugin=protoc-gen-grpc-gateway=$(GOPATH)/bin/protoc-gen-grpc-gateway --plugin=protoc-gen-swagger=$(GOPATH)/bin/protoc-gen-swagger --grpc-gateway_out=logtostderr=true,paths=source_relative:. --swagger_out=logtostderr=true:. --go_out=plugins=grpc,paths=source_relative:. daemon/grpc/services/daemon.proto
# 	protoc --go_out=plugins=grpc,paths=source_relative:. daemon/grpc/services/daemon.proto