package middleware

import (
	"net/http"

	"github.com/IamPrommate/chat-it/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		token, err := utils.ValidateJwtToken(tokenString)
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		userIDRaw, ok := claims["user_id"]
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
			c.Abort()
			return
		}
		userID, ok := userIDRaw.(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID format in token"})
			c.Abort()
			return
		}

		username := claims["username"].(string)

		c.Set("userId", userID)
		c.Set("username", username)

		c.Next()
	}

}
