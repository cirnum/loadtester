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
func (p *provider) GetAllEc2s(ctx context.Context) ([]models.EC2, error) {
	var ec2s []models.EC2
	result := p.db.Find(&ec2s)
	if result.Error != nil {
		return nil, result.Error
	}
	return ec2s, nil
}
