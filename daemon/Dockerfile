# Start from a Debian image with Go 1.13 installed and a workspace (GOPATH)
# configured at /go.
FROM golang:1.15-alpine as builder

# Set working directory to be daemon in this repository
WORKDIR /go/src/github.com/singerdmx/BulletJournal/daemon

# Copy 
COPY cmd cmd
COPY clients clients
COPY config config
COPY utils utils
COPY persistence daos
COPY logging logging
COPY api api
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

# Add curl for health check
RUN apk update && apk add curl

# Copy executable to target folder
COPY --from=builder /go/bin/daemon-server /go/bin/

# Copy configuration files to /config folder
ARG tier=dev
ARG sourceConfigPath=config/config-${tier}.yaml
ARG destConfigPath=/${sourceConfigPath}
ENV tierEnv $tier
COPY config/config.yaml /config/config.yaml
COPY ${sourceConfigPath} ${destConfigPath}

# Run the grpc command by default when the container starts.
ENTRYPOINT /go/bin/daemon-server -${tierEnv}

# Document that the service listens on port 50051.
EXPOSE 50051