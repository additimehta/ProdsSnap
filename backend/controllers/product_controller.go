package controllers

import (
	"context"
	"fmt"
	"net/http"
	"prodsnap/config"
	"prodsnap/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CREATION

func CreateProduct(c *gin.Context) {
	name := c.PostForm("name")
	description := c.PostForm("description")
	priceStr := c.PostForm("price")
	createdBy := c.PostForm("createdBy")

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
		return
	}

	filename := fmt.Sprintf("uploads/%s", file.Filename)
	if err := c.SaveUploadedFile(file, filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	product := models.Product{
		Name:        name,
		Description: description,
		Price:       price,
		Image:       filename,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Versions: []models.Version{{
			ID:            primitive.NewObjectID(),
			VersionNumber: "v1.0",
			Changes:       "Initial version",
			CreatedAt:     time.Now(),
			CreatedBy:     createdBy,
		}},
	}

	_, err = config.DB.Collection("products").InsertOne(context.TODO(), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Product created successfully!"})
}

// edit the version
func AddVersion(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var input struct {
		Title     string `json:"title"`
		Changes   string `json:"changes"`
		CreatedBy string `json:"createdBy"`
	}
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	collection := config.DB.Collection("products")
	var product models.Product
	if err := collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&product); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	nextVersion := "v1.0"
	if len(product.Versions) > 0 {
		last := product.Versions[len(product.Versions)-1]
		var major int
		fmt.Sscanf(last.VersionNumber, "v%d.0", &major)
		nextVersion = fmt.Sprintf("v%d.0", major+1)
	}

	newVersion := models.Version{
		ID:            primitive.NewObjectID(),
		ProductID:     objID,
		VersionNumber: nextVersion,
		Title:         input.Title,
		Changes:       input.Changes,
		CreatedAt:     time.Now(),
		CreatedBy:     input.CreatedBy,
	}

	update := bson.M{
		"$push": bson.M{"versions": newVersion},
		"$set":  bson.M{"updatedAt": time.Now()},
	}
	_, err = collection.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add version"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Version added!", "versionNumber": nextVersion})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func DeleteProduct(c *gin.Context) {
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
