package services

import (
	"context"
	"errors"
	"time"

	"github.com/IamPrommate/chat-it/models"
	"github.com/IamPrommate/chat-it/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddBudget(userId string, request models.RequestBudget) error {
	objUserId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return err
	}

	budget := models.Budget{
		UserID:   objUserId,
		Category: request.Category,
		Limit:    request.Budget,
		Month:    request.Month,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return repository.AddBudget(ctx, budget)
}

func ViewBudgetById(userID string) ([]models.Budget, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return repository.ViewBudgetById(ctx, userID)
}

func UpdateBudgetById(userID string, id string, updates models.BudgetUpdateRequest) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	owns, err := repository.CheckBudgetOwnership(ctx, userID, id)
	if err != nil {
		return err
	}
	if !owns {
		return errors.New("invalid budget owner")
	}

	return repository.UpdateBudgetById(ctx, id, updates)
}

func DeleteBudgetById(userID string, id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	owns, err := repository.CheckBudgetOwnership(ctx, userID, id)
	if err != nil {
		return err
	}
	if !owns {
		return errors.New("invalid budget owner")
	}

	return repository.DeleteBudgetById(ctx, id)
}
