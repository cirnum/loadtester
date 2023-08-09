<div align="center">
<h1>
  <img src="https://raw.githubusercontent.com/cirnum/loadtester/main/ui/src/assets/brand.svg" width="300">
</h1>
<b>Scale Your Load Testing Efforts with Loadtester.</b>
<p>Loadtester is a powerful tool that helps you simulate millions of concurrent users by distributing load tests across multiple computers.
</p>
</div>

<p align="center">
  <a  target="_blank" href="https://docs.perfcheck.com/">Docs</a> | <a href="https://www.perfcheck.com/">Demo</a> | <a href="https://discord.gg/SQ5DZEBt">Help And Support</a>  
</p>

<img src="https://github.com/cirnum/loadtester/blob/main/ui/src/assets/loadtester.gif" >


# Install - [ref](https://docs.perfcheck.com/installation)
### npm 
    npm install loadster -g && loadster

> Note: In case of permission issue try it with sudo.

### Script for linux and macOs versions
    curl -sL https://raw.githubusercontent.com/cirnum/loadtester/main/installer/bash/install-loadtester.sh | sudo bash && loadster

## binary 
    https://docs.perfcheck.com/installation#install-with-shell-script
    
    
## Run as a worker
    loadster --WORKER=true --MASTER_IP="MASTER_NODE_IP_OR_DNS"

You have the convenience of directly incorporating a worker node into the master web UI and synchronizing from there, eliminating the need for the MASTER_IP argument.

 
Steps: `Server` > `Add New Server` > `Sync With Master` ( In Web ui )

# How to Use
Scale Your Load Testing Efforts with Loadtester.

Loadtester is a powerful tool that helps you simulate millions of concurrent users by distributing load tests across multiple computers.

Steps:

1.  Install Loadtester on your local machine or server.
2.  Use the intuitive graphical interface to design your load test scenario.
3.  Configure test settings such as the number of virtual users, test duration, and test environment.
4.  Distribute the load test across multiple machines or servers using the Loadtester controller.
5.  Monitor test results in real time using built-in reporting and analysis tools.
6.  Analyze test results to identify performance bottlenecks and optimize your system for maximum scalability.

Try Loadtester today and discover how it can help you improve the performance and scalability of your application or website.


  

### Create server

Note - because of resource limit (CPU, bandwidth) you can configure

as many servers as you can run the test script across all the servers at the same time.

## Possible ENV to pass while running the Binary
| Env Name  | Default | Description                                                                                                      |
|-----------|---------------|------------------------------------------------------------------------------------------------------------------|
| WORKER    | false         | User can run loadtester as a worker or as a Master node                                                            |
| MASTER_IP | empty            | If the user runs the node as a Worker then the worker node can accept the MASTER_IP env which is the actual master ip |



# Download binary - [ref](https://docs.perfcheck.com/installation#download-binary-releases)
	1. `Darwin amd64` - For Mac user
	2. `Darwin arm64` - For Mac users (new Mac)
	3. `Linux amd64` - Linux arch `amd64` users (64-bit system)
	4. `Linux arm64` - Linux arch `arm` users (32-bit system)
	5. `windows amd64` - Windows Users


## Creating the first request

1. Click on **Request** tab on header

2. Fill out the form

* Url - stress testing target Url

* Client - Total client wants to initiate - use 100 to 1000 (depends on your cores and cpu)

* Time - Till the time you want to run these requests

* Select Method Get Post whatever your stress url serve

## AWS integration (Required Env)
| Env Name       |
|----------------|
| AWS_ACCESS_KEY |
| AWS_SECRET_KEY |
| AWS_REGION     |

## Request Page

<img width="956" alt="Screenshot 2023-06-20 at 7 29 03 PM" src="https://github.com/cirnum/loadtester/assets/24589611/70190661-9622-4b3a-b574-3ac55725bb68">

## Request Stats - You can check request stats here
<img width="953" alt="Screenshot 2023-06-20 at 7 30 55 PM" src="https://github.com/cirnum/loadtester/assets/24589611/cffbf239-0ecd-4335-8c4c-3ea6d019ec4d">

## AWS section - Create multiple nodes for distributed testing
<img width="958" alt="Screenshot 2023-06-20 at 7 33 53 PM" src="https://github.com/cirnum/loadtester/assets/24589611/c5db347b-d8c3-47cd-94c0-ffcba1ad1085">

## Check, enable, and disable the connected nodes from the server section
<img width="958" alt="Screenshot 2023-06-20 at 7 35 34 PM" src="https://github.com/cirnum/loadtester/assets/24589611/7aac3ede-9a2b-4485-9a47-a7006852ec2c">

