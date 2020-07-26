# Start from a Debian image with Go 1.13 installed and a workspace (GOPATH)
# configured at /go.
FROM golang:1.13-alpine

# Set working directory to be daemon in this repository
WORKDIR /go/src/github.com/singerdmx/BulletJournal/daemon

# Copy 
COPY servers/grpc/. ./servers/grpc/.
COPY protobuf/. ./protobuf/.
COPY go.mod .
COPY vendor/. ./vendor/.

# Build the grpc command inside the container.
RUN apk update && \
    apk add git protobuf && \
    go get -u github.com/golang/protobuf/protoc-gen-go

RUN go build -mod=vendor -o /go/bin/hello-server servers/grpc/main.go

# Run the grpc command by default when the container starts.
ENTRYPOINT [ "/go/bin/hello-server" ]

# Document that the service listens on port 50051.
EXPOSE 50051