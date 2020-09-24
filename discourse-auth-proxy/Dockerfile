FROM golang:alpine as builder
RUN apk add git
WORKDIR /go/src/github.com/discourse/discourse-auth-proxy
COPY internal ./internal/
COPY logging ./logging/
COPY *.go ./
RUN go get && go build

FROM alpine:latest
COPY bulletjournal.us.cert /bin/
COPY bulletjournal.us.key /bin/
COPY --from=builder /go/bin/discourse-auth-proxy /bin/
COPY start.sh /bin/start.sh
CMD ["/bin/start.sh"]
