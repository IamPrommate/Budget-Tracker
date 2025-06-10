package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Expense struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserID      primitive.ObjectID `bson:"user_id"`
	Amount      float64            `bson:"amount"`
	Type        ExpenseType        `bson:"type"`
	Category    string             `bson:"category"`
	Date        time.Time          `bson:"date"`
	Description string             `bson:"description,omitempty"`
}

type AddExpense struct {
	Amount      float64   `bson:"amount"`
	Category    string    `bson:"category"`
	Date        time.Time `bson:"date"`
	Description string    `bson:"description,omitempty"`
}

type ExpenseType string

const (
	ExpenseTypeIncome  ExpenseType = "income"
	ExpenseTypeExpense ExpenseType = "expense"
)
