## ----POSTGRES

docker run \
 --name postgres \
 -e POSTGRES_USER=fe\
 -e POSTGRES_PASSWORD=fe2023\
 -e POSTGRES_DB=heros \
 -p 5432:5432 \
 -d \
 postgres

## ----POSTGRES

docker ps

docker exec -it postgres /bin/bash

## ----ADMINER

docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
adminer \

## ----ADMINER

docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer

## ----ADMINER

## ----MONGO DB

docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -d mongo:4

## ----CLIENTE MONGO DB

docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient

## ----Criar usuario do banco ?

docker exec -it mongodb mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({user: 'felipe', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'herois'}]})"
