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

	}
}
