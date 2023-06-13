package models

type EC2 struct {
	ID               string `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
	PrivateIp        string `json:"privateIp,omitempty"`
	PublicIp         string `json:"publicIp,omitempty"`
	PublicDns        string `json:"publicDns,omitempty"`
	Architecture     string `json:"type,arch"`
	ImageId          string `json:"imgId,omitempty"`
	InstanceType     string `json:"instanceType,omitempty"`
	PrivateDnsName   string `json:"privateDns,omitempty"`
	Ec2State         string `json:"ec2State,omitempty"`     // pending, running
	Ec2StateCode     int64  `json:"ec2StateCode,omitempty"` // 0 - pending, 16 - Running
	AvailabilityZone string `json:"availabilityZone,omitempty"`
	InstanceId       string `json:"instanceId,omitempty"`
	KeyName          string `json:"keyName,omitempty"`
	UpdatedAt        int64  `json:"updated_at" bson:"updated_at"`
	CreatedAt        int64  `json:"created_at" bson:"created_at"`
}

type EC2KeyPair struct {
	ID        string `gorm:"primaryKey;type:char(36)" json:"id,omitempty"`
	KeyName   int64  `json:"keyName,omitempty"`
	Value     int64  `json:"value,omitempty"`
	UpdatedAt int64  `json:"updated_at" bson:"updated_at"`
	CreatedAt int64  `json:"created_at" bson:"created_at"`
}
