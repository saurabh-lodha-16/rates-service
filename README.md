# rates-service

A project that serves and stores latest rates for crypto-currencies. 

## Introduction

The service serves live rates of crypto-currencies retrieved from the CyptoCompare APIs. A scheduler runs every minute, fetches these rates automatically and stores them in the database. The service can be used to fetch latest rates for crypto-currencies and it exposes several APIs to accomplish the task. You can choose to fetch the live rates which straight up serves rates from the CryptoCompare APIs or if there is any discrepancy in getting responses or if the CryptoCompare APIs are down, the service serves latest rates from the database. 

The scheduler also makes sure to publish the latest rates via Websocket to the clients that are connected to the service. This helpes in various ways as the clients do not need to add any API integration code and can just fetch the rates via Websocket. It also serves the purpose of making the service the single point of truth. This means all the rates (live and refreshed every minute) all come from the rates service so the respective clients (wallets and dapps) can use this as a consistent source of rates rather than to poll the APIs continuously. 

The service is developed using [NestJS](https://nestjs.com/).

## How to

### Pre-requisites

1. Install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

> The Dockerfile takes care of installing the packages and starting the service.

### Start the service

Add a .env file in root directory. Duplicate the contents of `.env-dev` file present in the same directory.
Make sure to insert a `CRYPTOCOMPARE_API_KEY` value before you start the service.

All the contents of the .env-dev is configurable and its upon the user to adjust the respective parameters (further explained) to configure the service.

Once the above steps are completed from the root run -

```shell script
$ docker-compose build
$ docker-compose up -d
```

This should start the docker containers and the scheduler shows the initial service logs without any error. 
Docker handles the creation of database and the rates are stored in the created database by the scheduler.

To check the logs for the service -

```shell script
$ docker logs rates-service -f
```

The following variables in the .env file need to be updated/checked for running the bots -

```
NODE_ENV=development
NODE_PORT=3000
# Parameters used for database configuration and connection
DB_TYPE=postgres
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=database
DB_SCHEMA=public
DB_SYNCHRONIZATION=true
# Parameters used for rates retrieval and configuration.
BASE_CURRENCY_PAIRS=BTC,ETH,LTC,DOGE
TARGET_CURRENCY_PAIRS=USD,EUR
CRYPTOCOMPARE_URL=https://min-api.cryptocompare.com/data/pricemulti?fsyms={fsyms}&tsyms={tsyms}
CRYPTOCOMPARE_API_KEY=5dcf24442581b1fb77ea2786066c982c29b8751089ad4b02d11ef266cc253de9
RATES_RETRIEVAL_INTERVAL=EVERY_MINUTE
```

### Using the service

The service serves three APIs. All the APIs can be used directly by the swagger integration added here - `http://localhost:3000/api/`
Postman Collection is also added as part of the repository and should be imported to add the collection as part of postman application.


#### Get Live Rates

This API serves live rates from the Crypto Compare APIs. There is a requirement to enter the from and to currencies which act as `BASE_CURRENCIES` and `TARGET_CURRENCIES`. For example, if you need the rates of BTC and ETH in USD and EUR, your params will be 
```
from=`BTC,ETH`
to=`USD,EUR`
```
Once added correctly as query params, the API returns the rates correctly. Provision is made that if the service is down, the latest rates from the database is served (filtered as per the inputs)

#### Get Latest Rate

Served latest rate saved in the database. This API can be used to serve rates if the service is down and if the default option is to take rates from the database.

#### Get Rate by ID

Serves the particular rate from the databse wrt to the ID param provided. This API can be used to fetch historical rates from the database

Other than rates APIs, there is another API that acts as a health check. This checks the status of the service and database and returns the respective report. This can be extended in future for sending alerts and notifications.

#### Using Rates by Websockets

The scheduler that fetches the rates also pushes the rates to the websockets. This can be served by any client application. A demo application file has been added and it receives the rates from the service. This is possible because whenever a client connects to the service, the server joins it in the rates room. And the client receives all the further rates by being subscribed to the room and the message type `ratesWSEvent`
The interval to fetch rates for the scheduler can be modified and it will ppick up the newly set interval to fetch the rates and save them in the database. The user of the service can also customize the base and target currency pairs and thus the particular rates will be fetched from the APIS and stored in the db.

### Contribution
If you find any issues with the project, please feel free to raise an issue on Github. Would be awesome to receive your feedback and will help me improve.
