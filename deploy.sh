#!/bin/bash

# C-Tech Solutions Deployment Script
set -e

echo "🚀 Starting C-Tech Solutions deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please update .env file with your configuration before running again."
    exit 1
fi

# Load environment variables
source .env

# Install dependencies
print_status "Installing Node.js dependencies..."
npm ci --production

# Create necessary directories
print_status "Creating required directories..."
mkdir -p logs uploads dist

# Build the application
print_status "Building application..."
npm run build

# Check if MongoDB is running (for local deployment)
if [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
    print_status "Checking MongoDB connection..."
    
    if command -v mongod &> /dev/null; then
        if ! pgrep -x "mongod" > /dev/null; then
            print_warning "MongoDB is not running. Starting MongoDB..."
            sudo systemctl start mongod || brew services start mongodb-community || print_error "Failed to start MongoDB. Please start it manually."
        else
            print_status "MongoDB is already running."
        fi
    else
        print_warning "MongoDB not found. Using Docker or remote MongoDB."
    fi
fi

# Set up database
print_status "Setting up database..."
npm run db:setup

# Seed database with demo data
read -p "Do you want to seed the database with demo data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Seeding database with demo data..."
    npm run db:seed
fi

# Check deployment type
if [ "$1" = "docker" ]; then
    print_status "Deploying with Docker..."
    
    # Stop existing containers
    docker-compose down
    
    # Build and start containers
    docker-compose up -d --build
    
    print_status "Application deployed with Docker!"
    print_status "Access the application at: http://localhost"
    
elif [ "$1" = "pm2" ]; then
    print_status "Deploying with PM2..."
    
    # Install PM2 if not installed
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2..."
        npm install -g pm2
    fi
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ctech-solutions',
    script: 'server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 5000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};
EOF
    
    # Start with PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    print_status "Application deployed with PM2!"
    print_status "Access the application at: http://localhost:${PORT:-5000}"
    
else
    print_status "Starting development server..."
    npm run dev &
    
    print_status "Development server started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:5000"
fi

# Health check
sleep 5
print_status "Performing health check..."

if curl -f http://localhost:${PORT:-5000}/api/health > /dev/null 2>&1; then
    print_status "✅ Health check passed!"
else
    print_error "❌ Health check failed. Please check the logs."
fi

print_status "🎉 Deployment completed!"

echo ""
echo "📖 Default Login Credentials:"
echo "   Admin: admin@ctechsolutions.com / admin123456"
echo "   Student: te25bca002@techethica.in / password"
echo ""
echo "⚠️  Remember to:"
echo "   1. Change default passwords"
echo "   2. Configure SSL certificates for production"
echo "   3. Set up monitoring and backups"
echo "   4. Configure firewall rules"
