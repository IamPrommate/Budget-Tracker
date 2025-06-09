package repository

import (
	"context"
	"fmt"

	"github.com/IamPrommate/chat-it/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var budgetCollection *mongo.Collection

func SetupBudgetRepo(client *mongo.Client) {
	budgetCollection = client.Database("chatit_db").Collection("budget")
}

func CheckBudgetOwnership(ctx context.Context, userID string, id string) (bool, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return false, fmt.Errorf("invalid budget ID format: %w", err)
	}

	objUserID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return false, fmt.Errorf("invalid user ID format: %w", err)
	}

	filter := bson.M{
		"_id":     objID,
		"user_id": objUserID,
	}

	var budget models.Budget
	err = budgetCollection.FindOne(ctx, filter).Decode(&budget)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, fmt.Errorf("failed to check budget ownership: %w", err)
	}

	return true, nil
}

func AddBudget(ctx context.Context, budget models.Budget) error {
	filter := bson.M{
		"user_id":  budget.UserID,
		"category": budget.Category,
		"month":    budget.Month,
	}

	var existingBudget models.Budget
	err := budgetCollection.FindOne(ctx, filter).Decode(&existingBudget)
	if err == nil {
		return fmt.Errorf("a budget for this category and month already exists")
	} else if err != mongo.ErrNoDocuments {
		return fmt.Errorf("failed to check existing budget: %w", err)
	}

	_, err = budgetCollection.InsertOne(ctx, budget)
	if err != nil {
		return fmt.Errorf("failed to insert budget: %w", err)
	}

	return nil
}

func ViewBudgetById(ctx context.Context, userID string) ([]models.Budget, error) {
	objUserID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	filter := bson.M{"user_id": objUserID}

	cursor, err := budgetCollection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find budgets: %w", err)
	}

	var budgets []models.Budget
	if err := cursor.All(ctx, &budgets); err != nil {
		return nil, fmt.Errorf("failed to decode budgets: %w", err)
	}

	return budgets, nil
}

func UpdateBudgetById(ctx context.Context, id string, update models.BudgetUpdateRequest) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid budget ID format: %w", err)
	}

	updateDoc := bson.M{
		"$set": bson.M{
			"budget":   update.Budget,
			"category": update.Category,
			"month":    update.Month,
		},
	}

	result, err := budgetCollection.UpdateByID(ctx, objID, updateDoc)
	if err != nil {
		return fmt.Errorf("failed to update budget: %w", err)
	}
	if result.MatchedCount == 0 {
		return fmt.Errorf("no budget found with given ID")
	}

	return nil
}

func DeleteBudgetById(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid budget ID format: %w", err)
	}

	filter := bson.M{"_id": objID}

	_, err = budgetCollection.DeleteOne(ctx, filter)
	if err != nil {
		return fmt.Errorf("failed to delete budget: %w", err)
	}

	return nil
}
