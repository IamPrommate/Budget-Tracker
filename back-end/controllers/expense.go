package controllers

import (
	"fmt"
	"net/http"

	"github.com/IamPrommate/chat-it/models"
	"github.com/IamPrommate/chat-it/services"
	"github.com/gin-gonic/gin"
)

func AddExpense(c *gin.Context) {

	var request models.AddExpense

	if err := c.ShouldBindJSON(&request); err != nil {
		fmt.Println("BindJSON error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	userID, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	err := services.AddExpense(userID.(string), request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense Sucessfully Created."})
}
