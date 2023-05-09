package sql

import (
	"log"
	"os"
	"time"

	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/cirnum/strain-hub/server/pkg/constants"
	"github.com/glebarez/sqlite"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

type provider struct {
	db *gorm.DB
}

const (
	phoneNumberIndexName  = "UQ_phone_number"
	phoneNumberColumnName = "phone_number"
)

type indexInfo struct {
	IndexName  string `json:"index_name"`
	ColumnName string `json:"column_name"`
}

// NewProvider returns a new SQL provider
func NewProvider() (*provider, error) {
	var sqlDB *gorm.DB
	var err error
	customLogger := logger.New(
		logrus.StandardLogger(),
		logger.Config{
			SlowThreshold:             time.Second,  // Slow SQL threshold
			LogLevel:                  logger.Error, // Log level
			IgnoreRecordNotFoundError: true,         // Ignore ErrRecordNotFound error for logger
			Colorful:                  false,        // Disable color
		},
	)

	ormConfig := &gorm.Config{
		Logger:            customLogger,
		NamingStrategy:    schema.NamingStrategy{},
		AllowGlobalUpdate: true,
	}

	dbType := os.Getenv(constants.DbType)
	dbDNS := os.Getenv(constants.DbDns)
	log.Println("dbDNS:", dbType, dbDNS)
	switch dbType {
	case constants.DbTypeSQL:
		sqlDB, err = gorm.Open(mysql.Open(dbDNS), ormConfig)
	case constants.DbTypeSQLITE:
		sqlDB, err = gorm.Open(sqlite.Open(dbDNS+"?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)"), ormConfig)
	}

	if err != nil {
		return nil, err
	}

	// during create and update mutation.
	if sqlDB.Migrator().HasConstraint(&models.User{}, "authorizer_users_phone_number_key") {
		err = sqlDB.Migrator().DropConstraint(&models.User{}, "authorizer_users_phone_number_key")
		logrus.Debug("Failed to drop phone number constraint:", err)
	}

	err = sqlDB.AutoMigrate(&models.User{}, &models.Request{}, &models.Loadster{})
	if err != nil {
		return nil, err
	}

	return &provider{
		db: sqlDB,
	}, nil
}
