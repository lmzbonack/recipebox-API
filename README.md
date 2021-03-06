# Recipe Box - https://recipebox.dev/

> A project designed to make finding, shopping for, and cooking new things seamless

## Getting Started

This project makes use of Poetry and pyenv to manage Python versions and requirements. It also uses Docker Compose for development environments. You will need to have Docker and Docker Compose installed to develop on the application.

### Configuration
In order to run the application locally you will need to supply the following environment variables. 

```
JWT_SECRET_KEY - Key for JWT configuration
SECRET_KEY - Key for Flask App
MONGODB_USERNAME - Username for the app to connect to the DB
MONGODB_PASSWORD - Password for the app to connect to the DB
MONGO_INITDB_ROOT_USERNAME - Root username for the DB
MONGO_INITDB_ROOT_PASSWORD - Password for the DB
```

To deploy the application with Traefik these other variables are also needed
```
DOMAIN - The domain to deploy the app on
CLOUDFLARE_EMAIL - Email for Cloudlare 
CLOUDFLARE_API_KEY - Cloudflare API Key
CF_API_EMAIL - Same as CLOUDFLARE_EMAIL
CF_API_KEY - Same as CLOUDFLARE_API_KEY
```

### Running the app
The dev environment for the application is run through docker compose. The make this easier a make file with some helpful commands is provided. It is fully documented so feel free to dive into it. For now running
```sh
make rebuild-run
```
will build the app and display its logs which is helpful for debugging

#### Initializing the DB
Mongo DB needs to be initialized after the app is started

* docker exec -it mongodb bash
* mongo -u mongodbuser -p
* use recipebox
* db.createUser({user: 'flaskuser', pwd: 'password', roles: [{role: 'root', db: 'recipebox'}]})

#### Traefik
Scripting the Traefik deploy will be one of the next issues however for now I need to write down a few things here:

* Make sure to chmod 600 the acme.json file
* Make sure that the proxy network is created via docker before running `docker-compose up`
* Make sure that the DOMAIN environment variable is stored on the host system before running `docker-compose up`
