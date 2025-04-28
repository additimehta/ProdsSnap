package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"prodsnap/config"
	"prodsnap/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

)


type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct{
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	}	`json:"candiates`
}

func GetProductAnalytics(c *gin.Context) {
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

    // Fake market prices (pretend these are scraped trends)
    marketPrices := []float64{115, 110, 112, 120, 118, 125}

    minPrice := 110.0
    maxPrice := 140.0

    // Calculate trend
    trend := ((marketPrices[len(marketPrices)-1] - product.Price) / product.Price) * 100

    // Market Position
    var position string
    avgMarket := (minPrice + maxPrice) / 2
    if product.Price < avgMarket {
        position = "Below Market"
    } else if product.Price > avgMarket {
        position = "Above Market"
    } else {
        position = "At Market"
    }

    c.JSON(http.StatusOK, gin.H{
        "currentPrice": product.Price,
        "optimalPriceMin": minPrice,
        "optimalPriceMax": maxPrice,
        "priceTrendPercentage": fmt.Sprintf("%.2f", trend),
        "marketPosition": position,
        "marketTrendPrices": marketPrices,
    })
}
