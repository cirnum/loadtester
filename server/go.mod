module github.com/cirnum/strain-hub/server

go 1.15

// +heroku goVersion go1.15
require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/glebarez/sqlite v1.8.0
	github.com/gobuffalo/genny v0.1.1 // indirect
	github.com/gobuffalo/gogen v0.1.1 // indirect; indirect2
	github.com/gobuffalo/packr/v2 v2.2.0
	github.com/gofiber/embed v0.1.2
	github.com/gofiber/fiber/v2 v2.44.0
	github.com/gofiber/jwt/v2 v2.2.7
	github.com/google/uuid v1.3.0
	github.com/joho/godotenv v1.3.0
	github.com/pkg/errors v0.9.1 // indirect
	github.com/rcrowley/go-metrics v0.0.0-20201227073835-cf1acfcdf475
	github.com/sirupsen/logrus v1.8.1
	golang.org/x/crypto v0.7.0
	gorm.io/datatypes v1.2.0
	gorm.io/driver/mysql v1.5.0
	gorm.io/gorm v1.25.0
)
