#!/bin/bash
cd /var/www/aws-dynamic-website-learning/backend
npm install
cd /var/www/aws-dynamic-website-learning/frontend
npm install
npm run build -- --configuration production

# Install PM2 globally if not present and restart app
npm install -g pm2
cd /var/www/aws-dynamic-website-learning/backend
pm2 restart all || pm2 start index.js --name "todo-backend"