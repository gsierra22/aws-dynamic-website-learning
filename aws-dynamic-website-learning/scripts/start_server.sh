#!/bin/bash
set -e

# Load global binaries (ensure node/npm paths are mapped)
export PATH=$PATH:/usr/bin:/usr/local/bin

APP_DIR="/var/www/aws-dynamic-website-learning"

echo "=== Running Deploy Script ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 1. Install Backend Dependencies
echo "Installing backend dependencies..."
cd "$APP_DIR/backend"
npm install

# 2. Install Frontend Dependencies & Build Angular
echo "Installing frontend dependencies & building Angular..."
cd "$APP_DIR/frontend"
npm install
npm run build -- --configuration production

# 3. Start/Restart Express Server with PM2
echo "Starting Express server via PM2..."
cd "$APP_DIR/backend"
npm install -g pm2
pm2 restart todo-backend || pm2 start index.js --name "todo-backend"