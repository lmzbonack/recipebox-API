.PHONY: help build build-no-cache run rebuild watch stop nuke test lint lint-local apply-migrations
.DEFAULT: help
# print command help
help:
	@echo ""
	@echo "make build -> Build the containers"
	@echo "make build-no-cache -> Build containers without cache"
	@echo "make run -> Run docker containers in background and start the server at localhost:5000"
	@echo "make rebuild -> As "make run", but force container rebuild"
	@echo "make rebuild-run -> As "make rebuild", but not detatched"
	@echo "make watch -> Watch the docker logs of the running containers"
	@echo "make stop -> Stop the docker containers"
	@echo "make nuke -> Stop containers, delete them, and remove all volumes"
	@echo "make test -> Run tests in docker"
	@echo "make lint -> Run linting in docker"
	@echo "make lint-local -> Run linting in local venv"
build:
	@echo " -> Building containers"
	docker-compose build
	@echo " -> Containers built"
build-no-cache:
	@echo " -> Building containers without cache"
	docker-compose build --no-cache
	@echo " -> Containers built"
# Run the docker containers
run: build
	@echo " -> Composing containers"
	docker-compose up -d --build
	@echo " -> Containers running!"
# Completely rebuild the docker containers
rebuild: build-no-cache
	@echo " -> Rebuilding containers"
	docker-compose up -d --force-recreate
# Completely rebuild and then restart the docker containers without detaching
rebuild-run: build-no-cache
	@echo " -> Rebuilding containers and running"
	docker-compose up --force-recreate
# Watch the docker logs
watch:
	@echo " -> Monitoring docker"
	docker-compose logs -f
# Stop the running docker containers
stop:
	@echo " -> Killing containers"
	docker-compose stop
	@echo " -> Containers killed with predjudice"
# Nuke everything docker for a fresh start
nuke: stop
	@echo " -> Acheivement Unlocked: Overkill"
	docker-compose rm -f
	docker volume rm crm-graph-integration_postgres_data -f
	rm -rf postgres_data
	@echo " -> All containers and volumes vaporized, time for a fresh start"
# Run pytest
test:
	@echo " -> Running tests in docker"
	docker-compose exec web_test poetry run pytest
# Run flake8
lint:
	@echo " -> Running linting in docker"
	docker-compose exec web poetry run flake8
lint-local:
	@echo " -> Running linting locally"
	poetry run flake8
# DB legacy function
test-db:
	@echo "Starting Mongo"
	sudo mongod --dbpath ~/data/db
