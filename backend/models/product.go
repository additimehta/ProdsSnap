package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Version matches ProductVersion interface
type Version struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProductID      primitive.ObjectID `bson:"productId" json:"productId"`
	VersionNumber  string             `bson:"versionNumber" json:"versionNumber"`
	Title          string             `bson:"title" json:"title"`
	Changes        string             `bson:"changes" json:"changes"`
	CreatedAt      time.Time          `bson:"createdAt" json:"createdAt"`
	CreatedBy      string             `bson:"createdBy" json:"createdBy"`
}

// Product matches frontend interface
type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	Price       float64            `bson:"price" json:"price"`
	Image       string             `bson:"image" json:"image"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
	Versions    []Version          `bson:"versions" json:"versions"`
}

