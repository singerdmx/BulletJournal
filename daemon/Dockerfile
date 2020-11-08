FROM ubuntu as ubuntu-builder

RUN apt-get update -y  && \
    apt-get install curl zip make git -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata golang -y && \
    curl -OL https://github.com/google/protobuf/releases/download/v3.4.0/protoc-3.4.0-linux-x86_64.zip  && \
    unzip protoc-3.4.0-linux-x86_64.zip -d protoc3  && \
    mv protoc3/bin/* /usr/local/bin/  && \
    mv protoc3/include/* /usr/local/include/

RUN mkdir /app-daemon
WORKDIR /app-daemon

COPY proto_gen proto_gen

WORKDIR /app-daemon/proto_gen/github.com/singerdmx/BulletJournal/protobuf/daemon

RUN go get -u github.com/golang/protobuf/protoc-gen-go && \
    go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway && \
    go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger

WORKDIR /app-daemon/proto_gen/github.com/singerdmx/BulletJournal/protobuf/

RUN PATH=/root/go/bin:/root/go:$PATH GOPATH=/root/go make

# Start from a Debian image with Go 1.13 installed and a workspace (GOPATH)
# configured at /go.
FROM golang:1.15-alpine as builder

# Set working directory to be daemon in this repository
WORKDIR /go/src/github.com/singerdmx/BulletJournal/daemon
COPY --from=ubuntu-builder /app-daemon/proto_gen proto_gen
# Copy 
COPY api api
COPY cmd cmd
COPY clients clients
COPY config config
COPY consts consts
COPY logging logging
COPY persistence persistence
COPY rpc_server rpc_server
COPY utils utils
COPY go.mod .
COPY Makefile .
COPY proto_gen proto_gen

# Build the grpc command inside the container.
RUN apk update && \
    apk add git protobuf make && \
    go get -u github.com/golang/protobuf/protoc-gen-go

RUN go mod vendor && \
    GOOS=linux TARGET=/go/bin make build


# Target image with only executables
FROM alpine:latest

# Add curl for health check
RUN apk update && apk add curl && apk add --no-cache tzdata

# Copy executable to target folder
COPY --from=builder /go/bin/daemon-server /go/bin/

# Copy configuration files to /config folder
ARG tier=prod
ARG sourceConfigPath=config/config-${tier}.yaml
ARG destConfigPath=/${sourceConfigPath}
ENV tierEnv $tier
COPY config/config.yaml /config/config.yaml
COPY ${sourceConfigPath} ${destConfigPath}

# Run the grpc command by default when the container starts.
ENTRYPOINT /go/bin/daemon-server -${tierEnv}

# Document that the service listens on port 50051.
EXPOSE 50051
