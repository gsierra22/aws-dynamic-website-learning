#!/bin/bash
set -e

APP_DIR="/var/www/aws-dynamic-website-learning"

# Print current path for debugging in CodeDeploy logs
echo "Current directory: $(pwd)"
echo "Target directory: $APP_DIR"

# Verify destination directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "Error: $APP_DIR does not exist. Check appspec.yml file destination settings."
  exit 1
fi

# 1. Install Backend Dependencies
cd "$APP_DIR/backend"
npm install

# 2. Install Frontend Dependencies & Build Angular
cd "$APP_DIR/frontend"
npm install
npm run build -- --configuration production

# 3. Start Express Server with PM2
cd "$APP_DIR/backend"
npm install -g pm2
pm2 restart all || pm2 start index.js --name "todo-backend"