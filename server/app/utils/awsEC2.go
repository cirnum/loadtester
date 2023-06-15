package utils

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
	requstModels "github.com/cirnum/loadtester/server/app/models"
	"github.com/cirnum/loadtester/server/db/models"

	"fmt"
)

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
	sess, err := session.NewSessionWithOptions(session.Options{
		Profile: "default",
		Config: aws.Config{
			Region: aws.String("ap-south-1"),
		},
	})

	if err != nil {
		fmt.Printf("Failed to initialize new session: %v", err)
		return err
	}

	ec2Client := ec2.New(sess)

	keyName := "ec2-go-tutorial-key-name2"
	createRes, err := CreateKeyPair(ec2Client, keyName)
	if err != nil {
		fmt.Printf("Couldn't create key pair: %v", err)
		return err
	}

	err = WriteKey("./temp/"+keyName+".pem", createRes.KeyMaterial)
	if err != nil {
		fmt.Printf("Couldn't write key pair to file: %v", err)
		return err
	}
	fmt.Println("Created key pair: ", *createRes.KeyName)
	return nil
}

func DescribeKeyPairs(client *ec2.EC2) (*ec2.DescribeKeyPairsOutput, error) {
	result, err := client.DescribeKeyPairs(nil)
	if err != nil {
		return nil, err
	}

	return result, err
}

func GetKeyPair() error {
	sess, err := session.NewSessionWithOptions(session.Options{
		Profile: "default",
		Config: aws.Config{
			Region: aws.String("ap-south-1"),
		},
	})

	if err != nil {
		fmt.Printf("Failed to initialize new session: %v", err)
		return err
	}

	ec2Client := ec2.New(sess)

	keyPairRes, err := DescribeKeyPairs(ec2Client)
	if err != nil {
		fmt.Printf("Couldn't fetch key pairs: %v", err)
		return err
	}

	fmt.Println("Key Pairs: ")
	for _, pair := range keyPairRes.KeyPairs {
		fmt.Printf("%s \n", *pair.KeyName)
	}
	return nil
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

func CreateEC2(ec2Options requstModels.CreateEC2Options, userId string) ([]models.EC2, error) {
	sess, err := session.NewSessionWithOptions(session.Options{
		Profile: "default",
		Config: aws.Config{
			Region: aws.String("ap-south-1"),
		},
	})

	fmt.Println("ec2Options", ec2Options)
	if err != nil {
		fmt.Printf("Failed to initialize new session: %v", err)
		return nil, err
	}

	ec2Client := ec2.New(sess)

	newInstance, err := CreateInstance(ec2Client, ec2Options)
	if err != nil {
		fmt.Printf("Couldn't create new instance: %v", err)
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
	fmt.Println("Found instance id", instanceIds)
	result, err := client.DescribeInstances(&ec2.DescribeInstancesInput{
		InstanceIds: instanceIds,
		Filters: []*ec2.Filter{
			{
				Name: aws.String("instance-state-name"),
				Values: []*string{
					aws.String("running"),
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
	sess, err := session.NewSessionWithOptions(session.Options{
		Profile: "default",
		Config: aws.Config{
			Region: aws.String("ap-south-1"),
		},
	})

	if err != nil {
		fmt.Printf("Failed to initialize new session: %v", err)
		return foundEC2, err
	}

	ec2Client := ec2.New(sess)

	runningInstances, err := GetRunningInstances(ec2Client, getAllEC2InstanceIds(ec2s))
	if err != nil {
		fmt.Printf("Couldn't retrieve running instances: %v", err)
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
	fmt.Printf("Found running instance: %+v \n", foundEC2)

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
	sess, err := session.NewSessionWithOptions(session.Options{
		Profile: "default",
		Config: aws.Config{
			Region: aws.String("ap-south-1"),
		},
	})

	if err != nil {
		fmt.Printf("Failed to terminate new session: %v", err)
		return nil
	}

	ec2Client := ec2.New(sess)

	err = TerminateInstance(ec2Client, getInstanceIdList(instanceIds))
	if err != nil {
		return err
	}

	return nil
}
