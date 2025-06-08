package utils

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func CreateJwtToken(userID string, username string) (string, error) {
	err := godotenv.Load()
	if err != nil {
		return "", fmt.Errorf("error loading .env file: %w", err)
	}

	secretKey := os.Getenv("SECRET_KEY")
	if secretKey == "" {
		return "", errors.New("SECRET_KEY is not set in .env")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ValidateJwtToken(tokenString string) (*jwt.Token, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}

	secretKey := os.Getenv("SECRET_KEY")
	if secretKey == "" {
		return nil, errors.New("SECRET_KEY is not set in .env")
	}

	parsedToken, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || parsedToken == nil || !parsedToken.Valid {
		return nil, errors.New("JwtToken is not valid")
	}

	return parsedToken, nil
}
