package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Expense struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserID      primitive.ObjectID `bson:"user_id"`
	Amount      float64            `bson:"amount"`
	Category    string             `bson:"category"`
	Date        time.Time          `bson:"date"`
	Description string             `bson:"description,omitempty"`
}
