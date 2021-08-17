# Queue/Resolution API's for the app and basic frontend integration.

Queue API was created to simulate live queue in the clinic. It works closely with the Resolution API, which serves purpose of, basically, data storage of resolutions.

## Installation:

1. Run API in the 1'st terminal:

```sh
cd project1/backend
npm install
npm start
```

Note: you can use the following command to run the API in production mode, which limits the error messages.

```sh
npm run start:prod
```

2. Run frontend in the 2'nd terminal:

```sh
cd project1/frontend
npm install
npm start
```

3. Run redis server using terminal on linux or WSL on windows.

Access the website through:
http://localhost:5000/

## Tests:

To test the app, you need to install the API first, and then run:

```sh
npm run test
```

## Docker:

To install the app using Docker, you need to run:

```sh
cd project1
docker-compose up
```

To stop containers from running, you need to run:

```sh
cd project1
docker-compose down
```

Access the website through:
http://localhost:5000/

## API Docs:

The documentation was made using Swagger.

First, you need to install the app, following the installation process above, and then access the docs through:
http://localhost:8080/api-docs/
