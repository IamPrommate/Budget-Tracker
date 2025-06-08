package controllers

import (
	"fmt"
	"net/http"

	"github.com/IamPrommate/chat-it/models"
	"github.com/IamPrommate/chat-it/services"
	"github.com/gin-gonic/gin"
)

func AddBudget(c *gin.Context) {
	var request models.RequestBudget

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

	err := services.AddBudget(userID.(string), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to add budget"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Budget Sucessfully Created."})
}

func ViewBudget(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	budget, err := services.ViewBudgetById(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to view"})
		return
	}

	c.JSON(http.StatusOK, budget)
}
