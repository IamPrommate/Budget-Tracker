package repository

import (
	"context"

	"github.com/IamPrommate/chat-it/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var budgetCollection *mongo.Collection

func SetupBudgetRepo(client *mongo.Client) {
	budgetCollection = client.Database("chatit_db").Collection("budget")
}

func AddBudget(ctx context.Context, budget models.Budget) error {
	_, err := budgetCollection.InsertOne(ctx, budget)
	return err
}

func ViewBudgetById(ctx context.Context, userID string) ([]models.Budget, error) {
	objUserID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"user_id": objUserID}

	cursor, err := budgetCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var budgets []models.Budget
	if err := cursor.All(ctx, &budgets); err != nil {
		return nil, err
	}

	return budgets, nil
}
