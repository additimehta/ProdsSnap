package routes

import (
	"prodsnap/controllers"

	"github.com/gin-gonic/gin"
)

/*
RULES FOR TESTING CRUD MODELS
GO TO POSTMAN 
CREATION: POST  URL: http://localhost:8080/products << have a json body 
ADD VERSION: PUT URL:  http://localhost:8080/products/ { PRODUCT ID }/edit
GET PRODUCT: GET URL:   http://localhost:8080/products/ { PRODUCT ID }
GET ALL PRODUCTS: GET URL:   http://localhost:8080/products/
DELETE PRODUCT: DELETE URL:   http://localhost:8080/products/ { PRODUCT ID }

*/


func RegisterProductRoutes(r *gin.Engine) {
	products := r.Group("/products")
	{
		products.POST("", controllers.CreateProduct)
		products.PUT("/:id/edit", controllers.AddVersion)
		// get product by id
		products.GET("/:id", controllers.GetProduct)

		// get all products
		products.GET("", controllers.GetAllProducts)
		
		// Delete one product
		products.DELETE("/:id", controllers.DeleteProduct)


	}

}
