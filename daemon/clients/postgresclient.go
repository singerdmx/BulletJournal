package clients

import (
	"upper.io/db.v3/postgresql"
)

type PostgresClient struct {
	Settings postgresql.ConnectionURL
}