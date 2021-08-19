# nats_nodejs_exercise

You are required to implement an API gateway. An API gateway is a server that responsible for routing incoming requests to the relevant service and return the appropriate result. The architecture of your system should include the following components:

    NATS server - 3rd party (https://nats.io/) that acts as a medium between the gateway and the other services
    API Gateway server implemented by you using NATS client to interact with other services:
        listens for HTTP requests on port 80
        validates the request
        routes requests to the relevant service (apply some convention from the url path to the matched service.handler)
        responds with the result returned by the service
    Two services implemented by you and using NATS client to interact with the gateway:
        Math - expose subtract and divide handlers (each accept two parameters and return the result)
        Echo - expose echo handler which accept string and return it back
    The server and each service should be implemented as different decoupled processes
    Instructions for bootstrapping the system

Advantages:

    Put all the code in a public GitHub repository
    Several unit tests
    Use Docker to Dockerize your applications
    Use Docker Compose to bootstrap the system