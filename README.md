# api-stress-testing-tool (stress testing tool)

Demo - https://stress-testing-tool.web.app

# How to Use

### Create server
    Note - becasue of resource limit (cpu,bandwidth) you can configure
    as many server as you can to run test script across all the server at same time.
##    To configure Server 
    1.   Go to server tab
    2.   Click on - create new server
    3.   You created the server but still need to run connector on your server.
    4.   after creating click on copy command button
    5.   Now whatever you copied just paste in your server terminal to run connector
    6.   If all seems working fine then in status you got connected after 10 seconds.
    
## Creating first request 
    1.    Click on **Request** tab on header
    2.    Click to **Add new request**
    3.    Fill the form
            * Url - stress testing target Url
            * Client - Total client want to initiate - use 100 to 1000 (depends on your cores and cpu)
            * Time - Till time you want to run this requests
            * Connection type - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection ( don't want to read just select keep-alive )
            * Select Method Get Post whatever your stress url serve
    4. Finish - wait till time duration not complete and then click on open button 


    
  

    
    
    
        
