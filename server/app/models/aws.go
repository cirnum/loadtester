package models

type InstanceIdList struct {
	InstanceIds []string `json:"instanceIds"`
}

type CreateEC2Options struct {
	AMI          string `json:"ami"`
	KeyName      string `json:"keyName"`
	InstanceType string `json:"instanceType"`
	Count        int    `json:"count"`
}
