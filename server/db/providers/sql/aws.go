package sql

import (
	"context"
	"time"

	"github.com/cirnum/loadtester/server/db/models"
	"github.com/google/uuid"
)

// SaveEc2 to update user information in database
func (p *provider) CreateEC2(ctx context.Context, ec2s []models.EC2) ([]models.EC2, error) {
	ec2List := []models.EC2{}
	for _, ec2 := range ec2s {
		ec2.ID = uuid.New().String()
		ec2.CreatedAt = time.Now().Unix()
		ec2.UpdatedAt = time.Now().Unix()
		ec2List = append(ec2List, ec2)
	}

	result := p.db.Create(&ec2List)

	if result.Error != nil {
		return ec2List, result.Error
	}

	return ec2List, nil
}

// UpdateEc2 to update user information in database
func (p *provider) UpdateEc2(ctx context.Context, ec2s []models.EC2) ([]models.EC2, error) {
	ec2List := []models.EC2{}
	for _, ec2 := range ec2s {
		ec2.UpdatedAt = time.Now().Unix()
		ec2List = append(ec2List, ec2)
	}
	result := p.db.Save(&ec2List)

	if result.Error != nil {
		return ec2List, result.Error
	}
	return ec2List, nil
}

// UpdateEc2 Status to update user information in database
func (p *provider) UpdateEc2Status(ctx context.Context, ec2s []string, status string, code int) error {
	result := p.db.Model(models.EC2{}).Where("instance_id IN ?", ec2s).Updates(map[string]interface{}{"ec2_state": status, "ec2_state_code": code})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// get all ec2 by request Id to update user information in database
func (p *provider) GetAllEc2s(ctx context.Context, pagination *models.Pagination) (*models.EC2List, error) {
	userId := ctx.Value("userId")
	var ec2s []models.EC2

	result := p.db.Where("user_id = ?", userId).Limit(int(pagination.Limit)).Offset(int(pagination.Offset)).Order("created_at DESC").Find(&ec2s)
	if result.Error != nil {
		return nil, result.Error
	}

	var total int64
	totalRes := p.db.Model(&models.Request{}).Count(&total)
	if totalRes.Error != nil {
		return nil, totalRes.Error
	}

	paginationClone := pagination
	paginationClone.Total = total

	return &models.EC2List{
		Pagination: paginationClone,
		Data:       ec2s,
	}, nil
}
