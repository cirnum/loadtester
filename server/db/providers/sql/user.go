package sql

import (
	"context"
	"errors"
	"time"

	"github.com/cirnum/strain-hub/server/db/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// AddUser to save user information in database
func (p *provider) AddUser(ctx context.Context, user models.User) (models.User, error) {
	if user.ID == "" {
		user.ID = uuid.New().String()
	}

	user.CreatedAt = time.Now().Unix()
	user.UpdatedAt = time.Now().Unix()

	user, err := p.GetUserByEmail(ctx, user.Email)
	if err != nil {
		return user, err
	} else if user.Email != "" {
		return user, errors.New("User Already Register with us.")
	}

	result := p.db.Clauses(
		clause.OnConflict{
			Columns: []clause.Column{{Name: "email"}},
		}).Create(&user)

	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

// UpdateUser to update user information in database
func (p *provider) UpdateUser(ctx context.Context, user models.User) (models.User, error) {
	user.UpdatedAt = time.Now().Unix()

	result := p.db.Save(&user)

	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

// DeleteUser to delete user information from database
func (p *provider) DeleteUser(ctx context.Context, user models.User) error {
	result := p.db.Delete(&user)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

// ListUsers to get list of users from database
func (p *provider) ListUsers(ctx context.Context, pagination models.Pagination) (*models.Users, error) {
	var users []models.User
	result := p.db.Limit(int(pagination.Limit)).Offset(int(pagination.Offset)).Order("created_at DESC").Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}

	responseUsers := []models.User{}
	for _, user := range users {
		responseUsers = append(responseUsers, user)
	}

	var total int64
	totalRes := p.db.Model(&models.User{}).Count(&total)
	if totalRes.Error != nil {
		return nil, totalRes.Error
	}

	paginationClone := pagination
	paginationClone.Total = total

	return &models.Users{
		Pagination: &paginationClone,
		Users:      responseUsers,
	}, nil
}

// GetUserByEmail to get user information from database using email address
func (p *provider) GetUserByEmail(ctx context.Context, email string) (models.User, error) {
	var user models.User
	result := p.db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

// GetUserByID to get user information from database using user ID
func (p *provider) GetUserByID(ctx context.Context, id string) (models.User, error) {
	var user models.User

	result := p.db.Where("id = ?", id).First(&user)
	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

// UpdateUsers to update multiple users, with parameters of user IDs slice
// If ids set to nil / empty all the users will be updated
func (p *provider) UpdateUsers(ctx context.Context, data map[string]interface{}, ids []string) error {
	// set updated_at time for all users
	data["updated_at"] = time.Now().Unix()

	var res *gorm.DB
	if ids != nil && len(ids) > 0 {
		res = p.db.Model(&models.User{}).Where("id in ?", ids).Updates(data)
	} else {
		res = p.db.Model(&models.User{}).Updates(data)
	}

	if res.Error != nil {
		return res.Error
	}
	return nil
}
