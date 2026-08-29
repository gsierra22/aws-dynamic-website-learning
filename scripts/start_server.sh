#!/bin/bash
set -e

# Define root directory
APP_DIR="/var/www/aws-dynamic-website-learning"

# Ensure directory exists
mkdir -p $APP_DIR

# 1. Install Backend Dependencies
cd $APP_DIR/backend
npm install

# 2. Install Frontend Dependencies & Build Angular
cd $APP_DIR/frontend
npm install
npm run build -- --configuration production

# 3. Start Express Server with PM2
cd $APP_DIR/backend
npm install -g pm2
pm2 restart all || pm2 start index.js --name "todo-backend"