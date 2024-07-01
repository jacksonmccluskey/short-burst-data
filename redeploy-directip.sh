#!/bin/bash

cd <path-to-directory>/DirectIP
docker stop directip-server directip-api
docker rm directip-server directip-api
docker rmi directip-server directip-api
docker build -t directip-server ./ -f directip-server.dockerfile
docker build -t directip-api ./ -f directip-api.dockerfile
docker run --restart unless-stopped -d --name directip-server -p <server-port>:<server-port> -v ./.env:/app/directip-server/.env directip-server
docker run --restart unless-stopped -d --name directip-api -p <api-port>:<api-port> -v ./.env:/app/directip-api/.env directip-api
