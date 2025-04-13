package controllers

import (
	"context"
	"net/http"
	"time"

	"prodsnap/config"
	"prodsnap/models"

	"github.com/gin-gonic/gin"
)

func CreateProduct(c *gin.Context) {
	var input struct {
		Name        string `json:"name"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Price       string `json:"price"`
	}

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	product := models.Product{
		Name:      input.Name,
		CreatedAt: time.Now(),
		Versions: []models.Version{{
			Title:       input.Title,
			Description: input.Description,
			Price:       input.Price,
			Timestamp:   time.Now(),
		}},
	}

	collection := config.DB.Collection("products")
	_, err := collection.InsertOne(context.TODO(), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Product created successfully!"})
}


func AddVersion(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		Title 			string `json:"titile"`
		Description		string `json:"description"`
		Price			string `json:"price"`
	}

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	newVersion := models.Version {
		Title:			input.Title,
		Description:	input.Description,
		Price:			input.Price,
		Timestamp:		time.Now(),
	}

	objID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	collection := config.DB.Collection("products")
	update := bson.M{
		"$push": bson.M{"versions": newVersion},
	}

	_, err = collection.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add version"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Version added!"})

}
