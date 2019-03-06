
[![Build Status](https://travis-ci.org/oyewoas/senditdatabase.svg?branch=develop)](https://travis-ci.org/oyewoas/senditdatabase)
[![Coverage Status](https://coveralls.io/repos/github/oyewoas/senditdatabase/badge.svg?branch=develop)](https://coveralls.io/github/oyewoas/senditdatabase?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/0fea2c01cf42eb6943b9/maintainability)](https://codeclimate.com/github/oyewoas/senditdatabase/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0fea2c01cf42eb6943b9/test_coverage)](https://codeclimate.com/github/oyewoas/senditdatabase/test_coverage)

# senditdatabase
  Api for a courier service application that helps users deliver parcels to different destinations

### Getting Started
   If you want native test, you can just use `postman` to test, but real test, clone the repository, open terminal in root and do the following on terminal
   ```shell
   $ npm install
   ```

### Prerequisites
  NodeJs and Npm (https://nodejs.org/en/download/)

  PostgreSQL(https://www.postgresql.org/download/)

  create a .env file at the project root (senditdatabse/.env)

  DBeaver: DBeaver is free and open source universal database tool for developers and database administrators.
  (https://dbeaver.io/download/), this is optional though, you can use any other GUI for postgreSQL.

  ### Add these contents to .env file :-

    DATABASE_URL = "postgresql://postgres:databasepassword@localhost:5432/databasename"

    DB_HOST = localhost

    DB_PORT = 5432

    DB_NAME = database name

    DB_DIALET = postgresql

    DB_USER = postgres

    DB_PASS = databasepassword

    PORT = e.g 5000

    JWT_KEY = "secret"  
  

### Setting up project
  ```shell
  $ npm run setup
  ```
  This command helps you start up the server, create the database tables and helps you run tests

### License
  None for now.# senditdbherokuupdate
