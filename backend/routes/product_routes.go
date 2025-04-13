package routes

import (
	"prodsnap/controllers"

	"github.com/gin-gonic/gin"
)

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
