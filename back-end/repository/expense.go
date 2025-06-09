package repository

import (
	"context"
	"fmt"

	"github.com/IamPrommate/chat-it/models"
)

func AddExpense(ctx context.Context, expense models.Expense) error {
	_, err := budgetCollection.InsertOne(ctx, expense)
	if err != nil {
		return fmt.Errorf("failed to insert expense: %w", err)
	}
	return nil
}
