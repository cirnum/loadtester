# api-stress-testing-tool (stress testing tool)

  

Demo - https://www.perfcheck.com/

  

# How to Use

  

### Create server

Note - becasue of resource limit (cpu,bandwidth) you can configure

as many server as you can to run test script across all the server at same time.

## To configure Server with docker

1. `docker run -it -p 3005:3005 manojown1/loadtester:latest` (outer port can be change according to the need.)

  

## Download the binary

1. Download binary from releases - https://github.com/cirnum/loadtester/releases/
	1. `darwin amd64` - For mac user
	2. `linux amd64` - Linux arch `amd64` users (64 bit system)
	3. `linux arm64` - Linux arch `arm` users (32 bit system)
	4. `windows amd64` - Windows Users

## Creating first request

1. Click on **Request** tab on header

2. Fill the form

* Url - stress testing target Url

* Client - Total client want to initiate - use 100 to 1000 (depends on your cores and cpu)

* Time - Till time you want to run this requests

* Select Method Get Post whatever your stress url serve
