package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/IamPrommate/chat-it/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection

// func SetupUserRepo() {
// 	userCollection = utils.Client.Database("chatit_db").Collection("users")
// }

func SetupUserRepo(client *mongo.Client) {
	userCollection = client.Database("chatit_db").Collection("users")
}

var ErrUserNotFound = errors.New("user not found")

func FindUserByName(ctx context.Context, name string) (*models.User, error) {
	var user models.User
	err := userCollection.FindOne(ctx, bson.M{"username": name}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Printf("User not found: %s\n", name)
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	fmt.Printf("User found: %s\n", name)
	return &user, nil
}

func InsertUser(ctx context.Context, username, password string) error {
	user := models.User{
		Username: username,
		Password: password,
	}

	_, err := userCollection.InsertOne(ctx, user)
	return err
}
