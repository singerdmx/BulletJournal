module github.com/singerdmx/BulletJournal/daemon

go 1.15

require (
	github.com/go-redis/redis/v8 v8.0.0-beta.7
	github.com/grpc-ecosystem/grpc-gateway v1.14.6
	github.com/lib/pq v1.8.0 // indirect
	github.com/mailjet/mailjet-apiv3-go v0.0.0-20190724151621-55e56f74078c
	github.com/pkg/errors v0.8.1
	github.com/singerdmx/BulletJournal/protobuf/daemon v0.0.0-20200914003340-f274c779a632
	github.com/spf13/viper v1.7.1
	github.com/stretchr/testify v1.6.1
	github.com/zywangzy/JobScheduler v0.0.0-20200810024552-d2006de1954a
	go.uber.org/zap v1.16.0
	google.golang.org/grpc v1.31.0
	gopkg.in/natefinch/lumberjack.v2 v2.0.0
	gorm.io/driver/postgres v1.0.0
	gorm.io/gorm v1.20.1
	upper.io/db.v3 v3.7.1+incompatible
)
