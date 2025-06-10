package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Budget struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"user_id" json:"userId"`
	Limit  float64            `bson:"limit" json:"limit"`
	Month  time.Time          `bson:"month" json:"month"`
}

type RequestBudget struct {
	Limit float64   `json:"limit"`
	Month time.Time `json:"month"`
}

type BudgetUpdateRequest struct {
	Limit float64   `json:"limit"`
	Month time.Time `json:"month"`
}
