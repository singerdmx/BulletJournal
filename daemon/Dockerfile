# Start from a Debian image with Go 1.13 installed and a workspace (GOPATH)
# configured at /go.
FROM golang:1.13-alpine as builder

# Set working directory to be daemon in this repository
WORKDIR /go/src/github.com/singerdmx/BulletJournal/daemon

# Copy 
COPY servers/. ./servers/.
COPY protobuf/. ./protobuf/.
COPY go.mod .
COPY Makefile .

# Build the grpc command inside the container.
RUN apk update && \
    apk add git protobuf make && \
    go get -u github.com/golang/protobuf/protoc-gen-go && \
    go mod vendor && \
    GOOS=linux TARGET=/go/bin make build


# Target image with only executables
FROM alpine:latest

# Copy executable to target folder
COPY --from=builder /go/bin/daemon-server /go/bin/

# Run the grpc command by default when the container starts.
ENTRYPOINT [ "/go/bin/daemon-server" ]

# Document that the service listens on port 50051.
EXPOSE 50051