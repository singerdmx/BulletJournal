.PHONY: daemon-grpc-stub
daemon-grpc-stub:
	protoc --go_out=plugins=grpc,paths=source_relative:. $$(find daemon/grpc/types -name "*.proto")
	protoc -I. -I=third_party/googleapis --plugin=protoc-gen-grpc-gateway=$(GOPATH)/bin/protoc-gen-grpc-gateway --plugin=protoc-gen-swagger=$(GOPATH)/bin/protoc-gen-swagger --grpc-gateway_out=logtostderr=true,paths=source_relative:. --swagger_out=logtostderr=true:. --go_out=plugins=grpc,paths=source_relative:. $$(find daemon/grpc/services/ -name "*.proto")
