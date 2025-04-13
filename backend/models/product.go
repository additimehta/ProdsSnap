package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


// snapshot of that product in that time
type Version struct {
	Title       string    `bson:"title"`
	Description string    `bson:"description"`
	Price       string    `bson:"price"`
	Timestamp   time.Time `bson:"timestamp"`
}



// the original product
type Product struct {
	ID        primitive.ObjectID `bson:"_id"`
	Name      string             `bson:"name"`
	CreatedAt time.Time          `bson:"created_at"`
	Versions  []Version          `bson:"versions"`
}

