package services

import (
	"context"
	"time"

	"github.com/IamPrommate/chat-it/models"
	"github.com/IamPrommate/chat-it/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddExpense(userID string, request models.AddExpense) error {
	objUserId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	expense := models.Expense{
		UserID:      objUserId,
		Amount:      request.Amount,
		Category:    request.Category,
		Date:        request.Date,
		Description: request.Description,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return repository.AddExpense(ctx, expense)
}
