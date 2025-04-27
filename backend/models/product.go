package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Version matches ProductVersion interface
type Version struct {
	ID                  primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProductID           primitive.ObjectID `bson:"productId" json:"productId"`
	VersionNumber       string             `bson:"versionNumber" json:"versionNumber"`
	Title               string             `bson:"title" json:"title"`                    // updated title
	Changes             string             `bson:"changes" json:"changes"`                // description of what changed
	ImageAtThatVersion  string             `bson:"image,omitempty" json:"image,omitempty"` // optional new image
	PriceAtThatVersion  float64            `bson:"price,omitempty" json:"price,omitempty"` // price at that version
	DescriptionSnapshot string             `bson:"description,omitempty" json:"description,omitempty"` // description at that version
	CreatedAt           time.Time          `bson:"createdAt" json:"createdAt"`             // when this version was created
	CreatedBy           string             `bson:"createdBy" json:"createdBy"`             // who created the version
	IsRevert            bool               `bson:"isRevert,omitempty" json:"isRevert,omitempty"` // if reverted
	RevertedFromVersion string             `bson:"revertedFromVersion,omitempty" json:"revertedFromVersion,omitempty"` // original version if reverted
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

