# Load tester (stress testing tool)

  

Demo - https://www.perfcheck.com/ 

  

# How to Use
Scale Your Load Testing Efforts with Loadtester.

Loadtester is a powerful tool that helps you simulate millions of concurrent users by distributing load tests across multiple computers.

Steps:

1.  Install Loadtester on your local machine or server.
2.  Use the intuitive graphical interface to design your load test scenario.
3.  Configure test settings such as the number of virtual users, test duration, and test environment.
4.  Distribute the load test across multiple machines or servers using the Loadtester controller.
5.  Monitor test results in real-time using built-in reporting and analysis tools.
6.  Analyze test results to identify performance bottlenecks and optimize your system for maximum scalability.

Try Loadtester today and discover how it can help you improve the performance and scalability of your application or website.


  

### Create server

Note - becasue of resource limit (cpu,bandwidth) you can configure

as many server as you can to run test script across all the server at same time.

## To configure Server with docker

1. `docker run -it -p 3005:3005 --platform linux/amd64 manojown1/loadtester:latest` (outer port can be change according to the need.)

## Run as workers for distributed testing 
 `docker run -it -p ANY_AVAILABLE_PORT:3005 -e TOKEN="YOU_CAN_GET_WHILE_CREATE_SERVER" -e MASTER_IP="YOUR_MAIN_SERVER_IP" --platform linux/amd64 manojown1/loadtester:latest`

  

## Download the binary

1. Download binary from releases - https://github.com/cirnum/loadtester/releases/
	1. `darwin amd64` - For mac user
	2. `darwin arm64` - For mac user (new mac)
	3. `linux amd64` - Linux arch `amd64` users (64 bit system)
	4. `linux arm64` - Linux arch `arm` users (32 bit system)
	5. `windows amd64` - Windows Users

## Creating first request

1. Click on **Request** tab on header

2. Fill the form

* Url - stress testing target Url

* Client - Total client want to initiate - use 100 to 1000 (depends on your cores and cpu)

* Time - Till time you want to run this requests

* Select Method Get Post whatever your stress url serve

## AWS integration 
### Required Env for AWS - 
`AWS_ACCESS_KEY=<ACCESS_KEY>`
`AWS_SECRET_KEY=SECERET_KEY>`
`AWS_REGION=<ap-south-1>`


## Request Page

<img width="956" alt="Screenshot 2023-06-20 at 7 29 03 PM" src="https://github.com/cirnum/loadtester/assets/24589611/70190661-9622-4b3a-b574-3ac55725bb68">

## Request Stats - You can check request stats here
<img width="953" alt="Screenshot 2023-06-20 at 7 30 55 PM" src="https://github.com/cirnum/loadtester/assets/24589611/cffbf239-0ecd-4335-8c4c-3ea6d019ec4d">

## AWS section - Create multiple nodes for distributed testing
<img width="958" alt="Screenshot 2023-06-20 at 7 33 53 PM" src="https://github.com/cirnum/loadtester/assets/24589611/c5db347b-d8c3-47cd-94c0-ffcba1ad1085">

## Check, enable, and disable the connected nodes from the server section
<img width="958" alt="Screenshot 2023-06-20 at 7 35 34 PM" src="https://github.com/cirnum/loadtester/assets/24589611/7aac3ede-9a2b-4485-9a47-a7006852ec2c">

