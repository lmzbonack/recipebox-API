.PHONY: run test lint
# Start App
run:
	@echo "Starting App"
	poetry run flask run
# Run pytest
test:
	@echo "Testing"
	poetry run pytest
# Run Linter
lint:
	@echo "Linting"
	poetry run flake8
# Run Mongo
test-db:
	@echo "Starting Mongo"
	sudo mongod --dbpath ~/data/db
