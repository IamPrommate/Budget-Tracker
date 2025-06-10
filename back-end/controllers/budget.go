package controllers

import (
	"fmt"
	"log"
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

	log.Printf("Parsed request: %+v", request)

	userID, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	err := services.AddBudget(userID.(string), request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if budget == nil {
		c.JSON(http.StatusOK, []models.Budget{})
		return
	}

	c.JSON(http.StatusOK, budget)
}

func UpdateBudget(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Budget ID is required"})
		return
	}

	var input models.BudgetUpdateRequest
	log.Println(input)

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	err := services.UpdateBudgetById(userID.(string), id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Budget updated successfully",
		"budget_id": id,
	})

}

func DeleteBudget(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Budget ID is required"})
	}

	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	err := services.DeleteBudgetById(userID.(string), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Budget delete sucessfully",
		"budget_id": id,
	})
}
