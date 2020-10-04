module github.com/singerdmx/BulletJournal/daemon

go 1.15

require (
	github.com/davecgh/go-spew v1.1.1
	github.com/go-redis/redis/v8 v8.0.0-beta.7
	github.com/go-resty/resty/v2 v2.3.0
	github.com/golang/protobuf v1.4.2
	github.com/grpc-ecosystem/grpc-gateway v1.14.6
	github.com/lib/pq v1.8.0
	github.com/mailjet/mailjet-apiv3-go v0.0.0-20190724151621-55e56f74078c
	github.com/pkg/errors v0.8.1
	github.com/pmezard/go-difflib v1.0.0
	github.com/singerdmx/BulletJournal/protobuf/daemon v0.0.0-20200925010048-bc5fcf4ec0f7
	github.com/spf13/viper v1.7.1
	github.com/stretchr/objx v0.2.0
	github.com/stretchr/testify v1.6.1
	github.com/zywangzy/JobScheduler v0.0.0-20200810024552-d2006de1954a
	go.opentelemetry.io/otel v0.7.0
	go.uber.org/zap v1.16.0
	golang.org/x/net v0.0.0-20200513185701-a91f0712d120
	golang.org/x/sys v0.0.0-20200323222414-85ca7c5b95cd
	golang.org/x/text v0.3.3
	google.golang.org/genproto v0.0.0-20200808173500-a06252235341
	google.golang.org/grpc v1.31.0
	google.golang.org/protobuf v1.25.0
	gopkg.in/natefinch/lumberjack.v2 v2.0.0
	gopkg.in/yaml.v3 v3.0.0-20200313102051-9f266ea9e77c
	gorm.io/driver/postgres v1.0.0
	gorm.io/gorm v1.20.1
	upper.io/db.v3 v3.7.1+incompatible
)
