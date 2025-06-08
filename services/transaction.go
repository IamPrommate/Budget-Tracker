package services

import (
	"context"
	"errors"
	"time"

	"github.com/IamPrommate/chat-it/models"
	"github.com/IamPrommate/chat-it/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddBudget(userID string, request models.RequestBudget) error {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	var budget models.Budget = models.Budget{
		UserID:   objID,
		Category: request.Category,
		Limit:    request.Budget,
		Month:    request.Month,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = repository.AddBudget(ctx, budget)
	if err != nil {
		return errors.New("error adding budget")
	}
	return nil
}

func ViewBudgetById(userID string) ([]models.Budget, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	budget, err := repository.ViewBudgetById(ctx, userID)
	if err != nil {
		return nil, errors.New("error viewing budget")
	}
	return budget, nil
}
