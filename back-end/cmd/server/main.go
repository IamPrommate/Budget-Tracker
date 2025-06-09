package main

import (
	"fmt"
	"log"
	"os"

	"github.com/IamPrommate/chat-it/repository"
	"github.com/IamPrommate/chat-it/routes"
	"github.com/IamPrommate/chat-it/utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	r := gin.Default()

	// CORS middleware - allow your frontend origin and methods
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	routes.SetupRoutes(r)

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI is not set in .env")
	}

	utils.InitMongo()                        // sets utils.Client internally
	repository.SetupUserRepo(utils.Client)   // pass it to the repository
	repository.SetupBudgetRepo(utils.Client) // pass it to the repository

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	fmt.Println("Server is running on PORT:", port)
	err = r.Run(":" + port)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
