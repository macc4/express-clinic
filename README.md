# Queue/Resolution API's for the app and basic frontend integration.

Queue API was created to simulate live queue in the clinic.

Documentation can be accessed here:
https://documenter.getpostman.com/view/15720374/U16eu7wD

SQL diagram can be found here:
https://drawsql.app/personal-261/diagrams/clinic

## How to use:

- run the server, and then access the website.
- you can create a new account via the Sign up form (with a patient role), or Sign into an existing account (pre-created accounts can be found below.)
- via patient's personal account, you can view your own resolutions, or you can get into queue.
- via admin's account, you can process patients (submit resolutions), view all of the resolutions/users/patients (NOT YET IMPLEMENTED) or search resolutions via patient name.

Pre-created admin account:

email: 'admin@gmail.com',
password: '12345678',

## Installation:

### 0. Insert your mysql password in the configs.

You need to add your passwords into the ./config/default.yml and into the ./docker-compose.yml files.

Note: you may need to create a 'clinic' database via your mysql shell.

### 1. Git clone the repo, bundle front-end scripts and run the server.

First terminal:

```sh
npm install
npm run watch:js
npm start
```

Note: you can use the following command to run the API in production mode, which limits the error messages.

```sh
npm run start:prod
```

### 2. Run redis server using terminal on linux or WSL on windows.

Access the website through:
http://127.0.0.1:8080/

API endpoints can be accessed via:
http://127.0.0.1:8080/api/v1
(details are in the documentation)

## Tests:

To test the app, you need to install the API first, and then run:

```sh
npm run test
```

## Docker:

To install the app using Docker, you need to run in the root:

```sh
docker-compose up -d
```

To stop containers from running, you need to run in the root:

```sh
docker-compose down
```
