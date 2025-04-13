package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Version struct {
	Title       string    `bson:"title" json:"title"`
	Description string    `bson:"description" json:"description"`
	Price       string    `bson:"price" json:"price"`
	Timestamp   time.Time `bson:"timestamp" json:"timestamp"`
}

type Product struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"-"`
	Name      string             `bson:"name" json:"name"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	Versions  []Version          `bson:"versions" json:"versions"`
}
