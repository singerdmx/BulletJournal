GOOS ?= darwin
GOARCH ?= amd64
TARGET ?= target

.PHONY: daemon-server
daemon-server:
	GOOS=${GOOS} GOARCH=${GOARCH} go build -mod=vendor -o ${TARGET}/daemon-server cmd/server/main.go
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

BASE_GEN_DIR ?= ./proto_gen
PROTODIR ?= ../protobuf
PROTO_GO_PACKAGE_PREFIX ?= github.com/singerdmx/BulletJournal
GEN_DIR ?= ${BASE_GEN_DIR}/${PROTO_GO_PACKAGE_PREFIX}

.PHONY: gen_proto
gen_proto:
	rm -rf ${GEN_DIR}
	mkdir -p ${GEN_DIR}
	cp -rf ${PROTODIR} ${GEN_DIR}
	$(MAKE) -C ${GEN_DIR}/protobuf
