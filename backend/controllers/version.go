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


func generateNextVersionNumber(versions []models.Version) string {
	if len(versions) == 0 {
		return "v1.0"
	}

	last := versions[len(versions)-1]

	var major, minor int
	fmt.Sscanf(last.VersionNumber, "v%d.%d", &major, &minor)

	if minor < 9 {
		minor += 1
	} else {
		major += 1
		minor = 0
	}

	return fmt.Sprintf("v%d.%d", major, minor)
}

func AddVersion(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Handle optional image
	file, _ := c.FormFile("image")
	var imagePath string
	if file != nil {
		filename := fmt.Sprintf("uploads/%s", file.Filename)
		if err := c.SaveUploadedFile(file, filename); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save uploaded image"})
			return
		}
		imagePath = filename
	}

	// Get form fields
	title := c.PostForm("title")
	changes := c.PostForm("changes")
	createdBy := c.PostForm("createdBy")
	description := c.PostForm("description")
	priceStr := c.PostForm("price")

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price"})
		return
	}

	collection := config.DB.Collection("products")

	// Check if product exists
	var product models.Product
	if err := collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&product); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	nextVersion := generateNextVersionNumber(product.Versions)
	newVersion := models.Version{
		ID:                  primitive.NewObjectID(),
		ProductID:           objID,
		VersionNumber:       nextVersion,
		Title:               title,
		Changes:             changes,
		ImageAtThatVersion:  imagePath, 
		PriceAtThatVersion:  price,       
		DescriptionSnapshot: description,
		CreatedAt:           time.Now(),
		CreatedBy:           createdBy,
	}

	// Update the product + push new version
	updateFields := bson.M{
		"name":        title,       
		"description": description, 
		"price":       price,      
		"updatedAt":   time.Now(),  
	}
	if imagePath != "" {
		updateFields["image"] = imagePath // update image only if uploaded
	}

	update := bson.M{
		"$set":  updateFields,
		"$push": bson.M{"versions": newVersion},
	}

	_, err = collection.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product and add version"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated and version created!", "versionNumber": nextVersion})
}



func RevertVersion(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var body struct {
		VersionID string `json:"versionId"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	versionObjID, err := primitive.ObjectIDFromHex(body.VersionID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid version ID"})
		return
	}

	collection := config.DB.Collection("products")

	var product models.Product
	if err := collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&product); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Find the version to revert to
	var versionToRevert *models.Version
	for _, v := range product.Versions {
		if v.ID == versionObjID {
			versionToRevert = &v
			break
		}
	}

	if versionToRevert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Version not found"})
		return
	}

	// Create a new version
	nextVersion := generateNextVersionNumber(product.Versions)
	newVersion := models.Version{
		ID:                  primitive.NewObjectID(),
		ProductID:           objID,
		VersionNumber:       nextVersion,
		Title:               versionToRevert.Title,
		Changes:             fmt.Sprintf("Reverted to %s", versionToRevert.VersionNumber),
		ImageAtThatVersion:  versionToRevert.ImageAtThatVersion,
		PriceAtThatVersion:  versionToRevert.PriceAtThatVersion,
		DescriptionSnapshot: versionToRevert.DescriptionSnapshot,
		CreatedAt:           time.Now(),
		CreatedBy:           "System",
		IsRevert:            true,
		RevertedFromVersion: versionToRevert.VersionNumber,
	}

	// Update product fields
	updateFields := bson.M{
		"name":        versionToRevert.Title,
		"description": versionToRevert.DescriptionSnapshot,
		"price":       versionToRevert.PriceAtThatVersion,
		"updatedAt":   time.Now(),
	}
	if versionToRevert.ImageAtThatVersion != "" {
		updateFields["image"] = versionToRevert.ImageAtThatVersion
	}

	update := bson.M{
		"$set":  updateFields,
		"$push": bson.M{"versions": newVersion},
	}

	_, err = collection.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to revert product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product reverted successfully!", "versionNumber": nextVersion})
}
