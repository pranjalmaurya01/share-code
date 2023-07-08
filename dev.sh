#!/bin/bash
GREEN='\033[0;32m'
echo -e "${GREEN}Starting Both dev servers front(3000), back(3333)"
concurrently --names "front,back" "cd front && npm run dev" "cd back && npm run dev"
