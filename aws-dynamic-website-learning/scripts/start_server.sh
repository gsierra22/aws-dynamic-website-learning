#!/bin/bash
set -e

export PATH=$PATH:/usr/bin:/usr/local/bin

APP_DIR="/var/www/aws-dynamic-website-learning"

echo "=== Running Deploy Script ==="
echo "Node version: $(node -v)"

# 1. Backend
cd "$APP_DIR/backend"
npm install

# 2. Frontend (Limit memory usage so t2.micro doesn't freeze)
cd "$APP_DIR/frontend"
npm install
NODE_OPTIONS="--max-old-space-size=512" npm run build -- --configuration production

# 3. PM2 Backend Start
cd "$APP_DIR/backend"
npm install -g pm2
pm2 restart todo-backend || pm2 start index.js --name "todo-backend"