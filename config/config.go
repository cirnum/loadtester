package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/manojown/api-testing-premium/app/model"
	_ "github.com/mattn/go-sqlite3"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DbConfig struct {
	Client *mongo.Client
	User   model.User
}

func (db *DbConfig) initialize() {

	mongoURL := os.Getenv("MONGO_URL")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(
		mongoURL,
	))
	if err != nil {
		log.Fatal(err)
	}
	db.Client = client
}

func (db *DbConfig) Collection(collectionName string) *mongo.Collection {

	return db.Client.Database("test").Collection(collectionName)

}

func (db *DbConfig) Find(collectionName string, holder interface{}, filter interface{}, options *options.FindOptions) (interface{}, error) {

	dataHolder := findType(holder)
	collection := db.Client.Database("test").Collection(collectionName)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	cursor, err := collection.Find(ctx, filter, options)

	err = cursor.All(nil, &dataHolder)
	// log.Println("called", items, err)

	if err != nil {
		return nil, err
	}
	return dataHolder, nil

	// for cursor.Next(ctx) {
	// 	var item interface{}
	// 	if err = cursor.Decode(&item); err != nil {
	// 		return nil, err
	// 	}
	// 	items = append(items, item)
	// }
	// return items, nil
}

func NewConfig() *DbConfig {
	config := new(DbConfig)
	config.initialize()
	return config
}

func checkErr(err error) {
	if err != nil {
		panic("error is" + err.Error())
	}
}

func findType(x interface{}) interface{} {
	// log.Printf("Data of type %T and value %v", x, x)
	switch x.(type) {
	case []model.TestResponse:
		var response []model.TestResponse
		return response
	case []model.Configuration:
		var response []model.Configuration
		return response
	case []model.Server:
		var response []model.Server
		return response
	default:
		var response interface{}
		return response
	}

}
