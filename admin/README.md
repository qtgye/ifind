# Strapi application

A quick description of your strapi application

## Requirements

1. [Docker](https://www.docker.com/)  
2. [NodeJS](https://nodejs.org/) (TODO: Fully integrate into docker)

## Installation

1. Copy `.env.example` into `.env` and update the variables accordingly.  
    > **NOTE**: MYSQL variables are provided for local development. Production variables will be different.
2. Run `docker compose up -d` to start the mysql server.
3. Install dependencies: `npm install`.  
4. Run the admin server: `npm run develop`.  
