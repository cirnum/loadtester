package models

type InstanceIdList struct {
	InstanceIds []string `json:"instanceIds"`
}

type CreateEC2Options struct {
	AMI          string `json:"ami"`
	KeyName      string `json:"keyName"`
	InstanceType string `json:"instanceType"`
	Region       string `json:"region"`
	AwsProfile   string `json:"awsProfile"`
	Count        int    `json:"count"`
	AwsAccessKey string `json:"awsAccessKey"`
	AwsSecretKey string `json:"awsSecretKey"`
}
