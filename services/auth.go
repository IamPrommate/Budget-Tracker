package services

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/IamPrommate/chat-it/repository"
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

	return repository.InsertUser(ctx, username, password)
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

	if user.Password != password {
		return "", errors.New("invalid credentials")
	}

	// In real app, generate a JWT here
	return "abc123", nil
}
