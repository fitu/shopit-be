# DB
# Check DbTypes to see possible arguments
populatedb:
	docker-compose run shopit npm run seeder -- --type=sql
	docker-compose run shopit npm run seeder -- --type=no_sql
	docker-compose run shopit npm run seeder -- --type=in_memory

populate-sql:
	docker-compose run shopit npm run seeder -- --type=sql

populate-nosql:
	docker-compose run shopit npm run seeder -- --type=no_sql

populate-inmemory:
	docker-compose run shopit npm run seeder -- --type=in_memory

# Config
envs:
	docker-compose run shopit env

app-shell:
	docker-compose run shopit bash

ordersdb-shell:
	docker-compose run noSqlDB bash

usersdb-shell:
	docker-compose run sqlDB bash

# Utils
logs:
	docker-compose logs

# Images & Containers
build:
	docker-compose build

dev:
	docker-compose up

prod:
# TODO: add the prod file
	docker-compose -f docker-compose-prod.yml up

run-tests:
	docker-compose run shopit npm test

stop:
	docker-compose stop

down:
# It also removes the stopped containers as well as any networks that were created
	docker-compose down -v

remove:
	docker-compose rm -f -v

clean: stop down remove

init-dev: clean build populatedb dev

init-prod: clean build prod