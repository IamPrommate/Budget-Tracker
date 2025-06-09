package routes

import (
	"github.com/IamPrommate/chat-it/controllers"
	"github.com/IamPrommate/chat-it/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// 🔓 Public routes (no JWT required)
	r.POST("/login", controllers.Login)
	r.POST("/insertUser", controllers.InsertUser)

	// 🔒 Protected routes (JWT required)
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.POST("/budget", controllers.AddBudget)
		auth.GET("/budget", controllers.ViewBudget)
		auth.PUT("/budget/:id", controllers.UpdateBudget)
		auth.DELETE("/budget/:id", controllers.DeleteBudget)
		auth.POST("/expense", controllers.AddExpense)
	}
}
