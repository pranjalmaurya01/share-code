#!/bin/bash

GREEN='\033[0;32m'

npm install -g concurrently
concurrently --names "front,back" "cd front && npm i && exit 0" "cd back && npm i && exit 0"
echo -e "${GREEN}Successfully installed all(frontend, backend) packages"
