module github.com/singerdmx/BulletJournal/daemon

go 1.13

require (
	github.com/grpc-ecosystem/grpc-gateway v1.14.6
	github.com/lib/pq v1.8.0 // indirect
	github.com/mailjet/mailjet-apiv3-go v0.0.0-20190724151621-55e56f74078c
	github.com/singerdmx/BulletJournal/protobuf/daemon v0.0.0-20200816233320-96ed4fcf1053
	github.com/spf13/viper v1.7.1
	github.com/stretchr/testify v1.6.1
	github.com/zywangzy/JobScheduler v0.0.0-20200810024552-d2006de1954a
	go.uber.org/zap v1.15.0
	google.golang.org/grpc v1.31.0
	gopkg.in/natefinch/lumberjack.v2 v2.0.0
	upper.io/db.v3 v3.7.1+incompatible
)
