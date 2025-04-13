package main

import (
	"prodsnap/config"
	"prodsnap/routes"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	config.ConnectDB()

	// gin + routes
	r := gin.Default()
	r.Use(cors.Default()) // related to the frontend work on later if u have time
	routes.RegisterProductRoutes(r)
	r.RedirectTrailingSlash = false
	r.Run()
}
