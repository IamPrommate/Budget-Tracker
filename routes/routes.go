package routes

import (
	"github.com/IamPrommate/chat-it/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/login", controllers.Login)
	r.POST("/insertUser", controllers.InsertUser)
	r.POST("/addBudget", controllers.AddBudget)
	r.GET("/viewBudget", controllers.ViewBudget)
}
