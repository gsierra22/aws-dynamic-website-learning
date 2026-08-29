#!/bin/bash
set -e

export PATH=$PATH:/usr/bin:/usr/local/bin

APP_DIR="/var/www/aws-dynamic-website-learning"

echo "=== Running Deploy Script ==="
echo "Node version: $(node -v)"

# 1. Backend Dependencies
cd "$APP_DIR/backend"
npm install

# 2. Frontend Dependencies & Build
cd "$APP_DIR/frontend"
npm install
NODE_OPTIONS="--max-old-space-size=512" npm run build -- --configuration production

# 3. Start Express Server with PM2
cd "$APP_DIR/backend"
npm install -g pm2

# Check if PM2 is already running 'todo-backend'
if pm2 list | grep -q "todo-backend"; then
  echo "Restarting existing PM2 process..."
  pm2 restart todo-backend --update-env
else
  echo "Starting new PM2 process with server.js..."
  pm2 start server.js --name "todo-backend"
fi

# Save state so PM2 restarts on EC2 reboot
pm2 save