package utils

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func InitMongo() {
	mongoURI := os.Getenv("MONGO_URI")
	username := os.Getenv("MONGO_USERNAME")
	password := os.Getenv("MONGO_PASSWORD")

	credential := options.Credential{
		Username: username,
		Password: password,
	}

	clientOptions := options.Client().ApplyURI(mongoURI).SetAuth(credential)

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("Mongo connection error:", err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("Mongo ping error:", err)
	}

	fmt.Println("Connected to MongoDB!")
	Client = client
}
