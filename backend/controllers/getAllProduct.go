package controllers

import (
	"context"
	"net/http"
	"prodsnap/config"
	"prodsnap/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	
)

func GetAllProducts(c *gin.Context) {
	collection := config.DB.Collection("products")
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer cursor.Close(context.TODO())

	var products []models.Product
	if err := cursor.All(context.TODO(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode products"})
		return
	}

	c.JSON(http.StatusOK, products)
}
