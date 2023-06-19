package utils

import (
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
	requstModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/db/models"
	"github.com/cirnum/loadtester/server/pkg/configs"
	log "github.com/sirupsen/logrus"

	"fmt"
)

const (
	FailedToInitSessionMSG string = "Failed to initialize new session:"
	FailedToCreateKeyPair  string = "Couldn't create key pair:"
	FailedToFetchKeyPair   string = "Couldn't fetch key pairs:"
	FailedToCreateInstance string = "Couldn't create new instance:"
	FailedToFetchInstance  string = "Couldn't retrieve running instances:"
	WriteFailedMSG         string = "Couldn't write key pair to file:"
	RunningStat            string = "running"
	DefaultKey             string = "loadtester"
	TempDir                string = "/temp"
)

func sessionManager() (*session.Session, error) {
	return session.NewSessionWithOptions(session.Options{
		// Profile: "default",
		Config: aws.Config{
			Region:      &configs.StoreProvider.AWS_REGION,
			Credentials: credentials.NewStaticCredentials(configs.StoreProvider.AWS_ACCESS_KEY, configs.StoreProvider.AWS_SECRET_KEY, ""),
		},
	})
}
func CreateKeyPair(client *ec2.EC2, keyName string) (*ec2.CreateKeyPairOutput, error) {
	result, err := client.CreateKeyPair(&ec2.CreateKeyPairInput{
		KeyName: aws.String(keyName),
	})

	if err != nil {
		return nil, err
	}

	return result, nil
}

func WriteKey(fileName string, fileData *string) error {
	err := os.WriteFile(fileName, []byte(*fileData), 0400)
	return err
}

func CreatePem() error {
	sess, err := sessionManager()

	if err != nil {
		fmt.Printf("%s %v", FailedToInitSessionMSG, err)
		return err
	}

	ec2Client := ec2.New(sess)
	key := fmt.Sprintf("%d-%s", time.Now().Unix(), DefaultKey)
	createRes, err := CreateKeyPair(ec2Client, key)
	if err != nil {
		fmt.Printf("%s %v", FailedToCreateKeyPair, err)
		return err
	}

	path := fmt.Sprintf("./%s/%s.pem", TempDir, key)
	err = WriteKey(path, createRes.KeyMaterial)
	if err != nil {
		fmt.Printf("%s %v", WriteFailedMSG, err)
		return err
	}
	return nil
}

func DescribeKeyPairs(client *ec2.EC2) (*ec2.DescribeKeyPairsOutput, error) {
	result, err := client.DescribeKeyPairs(nil)
	if err != nil {
		return nil, err
	}

	return result, err
}

func GetKeyPair() ([]*string, error) {
	var keyPairs []*string
	sess, err := sessionManager()

	if err != nil {
		fmt.Printf("%s %v", FailedToInitSessionMSG, err)
		return keyPairs, err
	}

	ec2Client := ec2.New(sess)

	keyPairRes, err := DescribeKeyPairs(ec2Client)
	if err != nil {
		fmt.Printf("%s %v", FailedToFetchKeyPair, err)
		return keyPairs, err
	}

	for _, pair := range keyPairRes.KeyPairs {
		keyPairs = append(keyPairs, pair.KeyName)
	}
	return keyPairs, nil
}

// Create ec2
func CreateInstance(client *ec2.EC2, ec2Options requstModels.CreateEC2Options) (*ec2.Reservation, error) {
	res, err := client.RunInstances(&ec2.RunInstancesInput{
		ImageId:      aws.String(ec2Options.AMI),
		MinCount:     aws.Int64(int64(ec2Options.Count)),
		MaxCount:     aws.Int64(int64(ec2Options.Count)),
		InstanceType: aws.String(ec2Options.InstanceType),
		KeyName:      aws.String(ec2Options.KeyName),
	})

	if err != nil {
		return nil, err
	}

	return res, nil
}

func GetVpcUpdate() (string, error) {
	sess, err := sessionManager()
	svc := ec2.New(sess)
	result, err := svc.DescribeVpcs(nil)
	if err != nil {
		return "", err
	}
	if len(result.Vpcs) == 0 {
		return "", err
	}

	return aws.StringValue(result.Vpcs[0].VpcId), nil
}
func CreateSG() {
	GetVpcUpdate()
}
func CreateEC2(ec2Options requstModels.CreateEC2Options, userId string) ([]models.EC2, error) {

	sess, err := session.NewSessionWithOptions(session.Options{
		// Profile: "default",
		Config: aws.Config{
			Region:      &configs.StoreProvider.AWS_REGION,
			Credentials: credentials.NewStaticCredentials(configs.StoreProvider.AWS_ACCESS_KEY, configs.StoreProvider.AWS_SECRET_KEY, ""),
		},
	})

	if err != nil {
		log.Errorf("%s %v", FailedToInitSessionMSG, err)
		return nil, err
	}

	ec2Client := ec2.New(sess)

	newInstance, err := CreateInstance(ec2Client, ec2Options)
	if err != nil {
		log.Errorf("%s %v", FailedToCreateInstance, err)
		return nil, err
	}
	return filterEc2Data(newInstance.Instances, userId), nil
}

func filterEc2Data(ec2Payload []*ec2.Instance, userId string) []models.EC2 {
	ec2s := []models.EC2{}
	for _, instance := range ec2Payload {
		ec2 := models.EC2{}
		ec2.UserID = userId
		ec2.Architecture = *instance.Architecture
		ec2.AvailabilityZone = *instance.Placement.AvailabilityZone
		ec2.Ec2State = *instance.State.Name
		ec2.Ec2StateCode = *instance.State.Code
		ec2.ImageId = *instance.ImageId
		ec2.InstanceId = *instance.InstanceId
		ec2.InstanceType = *instance.InstanceType
		ec2.KeyName = *instance.KeyName
		ec2.PrivateDnsName = *instance.PrivateDnsName
		ec2.PrivateIp = *instance.PrivateIpAddress
		ec2s = append(ec2s, ec2)
	}
	return ec2s
}

func GetRunningInstances(client *ec2.EC2, instanceIds []*string) (*ec2.DescribeInstancesOutput, error) {
	result, err := client.DescribeInstances(&ec2.DescribeInstancesInput{
		InstanceIds: instanceIds,
		Filters: []*ec2.Filter{
			{
				Name: aws.String("instance-state-name"),
				Values: []*string{
					aws.String(RunningStat),
				},
			},
		},
	})

	if err != nil {
		return nil, err
	}

	return result, err
}

func getAllEC2InstanceIds(ec2s []models.EC2) []*string {
	allInstance := []*string{}
	for _, ec2 := range ec2s {
		allInstance = append(allInstance, aws.String(ec2.InstanceId))
	}
	return allInstance
}
func GetRunningInstance(ec2s []models.EC2) ([]models.EC2, error) {
	foundEC2 := []models.EC2{}
	mappEc2 := make(map[string]*ec2.Instance)

	pendingStateMap := make(map[string]bool)
	sess, err := sessionManager()
	if err != nil {
		fmt.Printf("%s %v", FailedToInitSessionMSG, err)
		return foundEC2, err
	}

	ec2Client := ec2.New(sess)

	runningInstances, err := GetRunningInstances(ec2Client, getAllEC2InstanceIds(ec2s))
	if err != nil {
		log.Errorf("%s %v", FailedToFetchInstance, err)
		return foundEC2, err
	}

	for _, reservation := range runningInstances.Reservations {
		for _, instance := range reservation.Instances {
			mappEc2[*instance.InstanceId] = instance
		}
	}

	for _, ec2Instance := range ec2s {
		instance := mappEc2[ec2Instance.InstanceId]
		if instance != nil && ec2Instance.InstanceId == *instance.InstanceId && *instance.State.Name == "running" {
			pendingStateMap[ec2Instance.InstanceId] = true
			ec2Instance.PublicDns = *instance.PublicDnsName
			ec2Instance.PublicIp = *instance.PublicIpAddress
			ec2Instance.Ec2State = *instance.State.Name
			ec2Instance.Ec2StateCode = *instance.State.Code
			foundEC2 = append(foundEC2, ec2Instance)
		}
	}

	return foundEC2, nil
}

func TerminateInstance(client *ec2.EC2, instanceId []*string) error {
	_, err := client.TerminateInstances(&ec2.TerminateInstancesInput{
		InstanceIds: instanceId,
	})

	return err
}

func getInstanceIdList(ids []string) []*string {
	allInstance := []*string{}
	for _, ec2 := range ids {
		allInstance = append(allInstance, aws.String(ec2))
	}
	return allInstance
}
func TerminateEC2(instanceIds []string) error {
	sess, err := sessionManager()

	if err != nil {
		return err
	}

	ec2Client := ec2.New(sess)

	err = TerminateInstance(ec2Client, getInstanceIdList(instanceIds))
	if err != nil {
		return err
	}

	return nil
}
