package services

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/IamPrommate/chat-it/repository"
	"github.com/IamPrommate/chat-it/utils"
)

func InsertUser(username, password string) error {
	username = strings.TrimSpace(username)
	password = strings.TrimSpace(password)

	if username == "" || password == "" {
		return errors.New("username and password are required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	existingUser, err := repository.FindUserByName(ctx, username)
	if err == nil && existingUser != nil {
		return errors.New("user already exists")
	}
	if err != nil && !errors.Is(err, repository.ErrUserNotFound) {
		return err
	}

	hashedPassword, err := utils.GenerateFromPassword([]byte(password), 4)
	if err != nil {
		return err
	}

	return repository.InsertUser(ctx, username, string(hashedPassword))
}

func Login(username, password string) (string, error) {
	username = strings.TrimSpace(username)
	password = strings.TrimSpace(password)

	if username == "" || password == "" {
		return "", errors.New("username and password are required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user, err := repository.FindUserByName(ctx, username)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return "", errors.New("user not found")
		}
		return "", err
	}

	err = utils.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	token, err := utils.CreateJwtToken(user.ID.Hex(), user.Username)
	if err != nil {
		return "", errors.New("error create jwt token")
	}

	return token, err
}
