package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Budget struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	UserID   primitive.ObjectID `bson:"user_id"`
	Category string             `bson:"category"`
	Limit    float64            `bson:"limit"`
	Month    time.Time          `bson:"month"`
}

type RequestBudget struct {
	Username string    `json:"username"`
	Budget   float64   `json:"budget"`
	Category string    `json:"category"`
	Month    time.Time `json:"month"`
}

type BudgetUpdateRequest struct {
	Budget   float64   `json:"budget"`
	Category string    `json:"category"`
	Month    time.Time `json:"month"`
}
