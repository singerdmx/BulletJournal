GOOS ?= darwin
GOARCH ?= amd64
TARGET ?= target

.PHONY: daemon-server
daemon-server:
	GOOS=${GOOS} GOARCH=${GOARCH} go build -mod=vendor -o ${TARGET}/daemon-server servers/main.go
	chmod a+x ${TARGET}/daemon-server

.PHONY: clean
clean:
	rm -rf ${TARGET}

.PHONY: build
build: daemon-server

.PHONY: docker
docker:
	rm -rf protobuf
	mkdir protobuf
	cp -r ../protobuf/daemon/* protobuf/.
	docker build --rm -t bulletjournal-daemon:latest .