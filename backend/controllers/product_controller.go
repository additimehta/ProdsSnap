package controllers

import (
	"context"
	"net/http"
	"time"
	"fmt"
	"prodsnap/config"
	"prodsnap/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CREATION
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
	res, err := collection.InsertOne(context.TODO(), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	fmt.Printf("Inserted product ID: %v\n", res.InsertedID)

	c.JSON(http.StatusCreated, gin.H{"message": "Product created successfully!"})
}


func AddVersion(c *gin.Context) {
	fmt.Println("EditProduct hit") 
	id := c.Param("id")

	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Price       string `json:"price"`
	}

	if err := c.BindJSON(&input); err != nil {
		fmt.Println("⚠️ JSON bind error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if input.Title == "" || input.Description == "" || input.Price == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	newVersion := models.Version{
		Title:       input.Title,
		Description: input.Description,
		Price:       input.Price,
		Timestamp:   time.Now(),
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


// Retrive the actual product
func GetProduct(c *gin.Context) {
	id := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var product models.Product
	collection := config.DB.Collection("products")
	err = collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&product)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}


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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse products"})
		return
	}

	c.JSON(http.StatusOK, products)
}



func DeleteProduct(c *gin.Context ) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	collection := config.DB.Collection("products")
	res, err := collection.DeleteOne(context.TODO(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}

