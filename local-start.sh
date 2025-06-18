#!/usr/bin/env bash

# Constants
NVM_DIR="$HOME/.nvm"
NODE_REQUIRED_MAJOR=20
CONTAINER_NAME="coffee_shop_postgres"
POSTGRES_USER="postgres"
IS_CONTAINER_MADE=false
MAX_RETRIES=30
RETRIES=0

# Banner
echo "========================="
echo "     Coffee Shop API     "
echo "========================="
echo ""

# Early notice
cat <<EOF
⚠️  This app uses a Docker container named "${CONTAINER_NAME}" for its database.
   If a container with that name is already running (even stopped), this script will fail.
   This script will reset your DBMS with fresh migrations and seed data.

   👉 Press Enter to continue, or Ctrl C to cancel and check your running containers.
EOF
read

# Fail helper
exit_helper() {
    echo "ℹ️  Exiting..."
    echo "$1"
    exit $2
}


# Cleanup
IS_CLEAN_UP_RAN=false
cleanup() {
    # Avoid running twice
    if [ "$IS_CLEAN_UP_RAN" = true ]; then
    	return
    fi
    IS_CLEAN_UP_RAN=true
    
    echo ""
    echo "🧹 Cleaning up..."

    echo "🔍 Checking for my running backend server..."
    if [ -n "$APP_PID" ]; then
    	echo "🔴 Stopping my backend server..."
        kill -TERM "$APP_PID" 2>/dev/null || true
        unset APP_PID
    fi
    echo "✅ My backend server stopped."

    echo "🔍 Checking for Docker..."
    if ! command -v docker >/dev/null 2>&1; then
    	echo "ℹ️  Docker is not installed."
        exit_helper "✅ Cleanup complete." 0
    fi
    echo "✅ Docker is installed."

    echo "🔍 Checking if I made my container..."
    if [ "$IS_CONTAINER_MADE" = true ]; then
        echo "ℹ️  Found my running '${CONTAINER_NAME}' container."
        echo "🛑 Stopping my running '${CONTAINER_NAME}' container..."
        docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
        docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
        exit_helper "✅ Cleanup complete." 0
    fi
    echo "ℹ️  I have not made my '${CONTAINER_NAME}' container."
    
    exit_helper "✅ Cleanup complete." 0
}

trap 'cleanup; exit $?' SIGINT SIGTERM EXIT

# Prerequisite Checks
echo "🔧 Checking prerequisites..."
echo ""

# Docker
echo "🔍 Checking for Docker..."
if ! command -v docker >/dev/null 2>&1; then
    exit_helper "❌ Docker is not installed." 1
fi
echo "✅ Docker is installed."

echo "🔍 Checking if Docker is running..."
if ! docker info >/dev/null 2>&1; then
    echo "❌ Cannot access Docker daemon."
    echo "💡 Or add your user to the 'docker' group (with caution)."
    exit_helper "❌ Docker is not running." 1
fi
echo "✅ Docker is running."

# Docker Compose
echo "🔍 Checking for Docker Compose..."
if ! docker compose version >/dev/null 2>&1; then
    exit_helper "❌ Docker Compose is not installed or not available as 'docker compose'." 1
fi
echo "✅ Docker Compose is available."

# Node.js
echo "🔍 Checking for Node.js..."
if ! command -v node >/dev/null 2>&1; then
    exit_helper "❌ Node.js not found." 1
fi
echo "✅ Node.js found."

echo "ℹ️  Getting Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d '.' -f 1)

echo "🔍 Checking if Node.js version is above v$NODE_REQUIRED_MAJOR..."
if [ "$NODE_MAJOR_VERSION" -lt "$NODE_REQUIRED_MAJOR" ]; then
    exit_helper "❌ Node.js $NODE_VERSION too old. Please upgrade to v$NODE_REQUIRED_MAJOR." 1
fi
echo "✅ Node.js version is above v$NODE_REQUIRED_MAJOR: $(node -v)"

# NVM
echo "🔍 Checking for NVM..."
if [ ! -f "$NVM_DIR/nvm.sh" ]; then
    exit_helper "❌ NVM not installed correctly in $NVM_DIR" 1
fi
echo "✅ NVM installed correctly in $NVM_DIR"

echo "ℹ️  Sourcing NVM command..."
source "$NVM_DIR/nvm.sh"

echo "🔍 Checking for NVM command..."
if ! command -v nvm >/dev/null 2>&1; then
    exit_helper "❌ NVM command not found after sourcing." 1
fi
echo "✅ NVM command found after sourcing with version: v$(nvm -v)"

echo "🌐 Checking internet connectivity..."
if ! ping -c 1 registry.npmjs.org >/dev/null 2>&1; then
    exit_helper "❌ No internet connection — can't run npm install." 1
fi
echo "✅ You are connected to the internet."

echo "⬇️  Installing Node.js v$NODE_REQUIRED_MAJOR with NVM..."
if ! nvm install "$NODE_REQUIRED_MAJOR"; then
    exit_helper "❌ Failed to install Node.js v$NODE_REQUIRED_MAJOR with NVM." 1
fi
echo "✅ Successfully installed Node.js v$NODE_REQUIRED_MAJOR."

echo "🔄 Switching to Node.js v$NODE_REQUIRED_MAJOR..."
if ! nvm use "$NODE_REQUIRED_MAJOR"; then
    exit_helper "❌ Failed to switch to Node.js v$NODE_REQUIRED_MAJOR with NVM." 1
fi
echo "✅ Now using Node.js $(node -v)"

echo "🔍 Checking for npm..."
if ! command -v npm >/dev/null 2>&1; then
    exit_helper "❌ npm not found. Please install Node.js and npm." 1
fi
echo "✅ npm is available."

# Container name check
echo "🔍 Checking for existing '${CONTAINER_NAME}' container..."
if docker container inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
    exit_helper "❌ A container named '${CONTAINER_NAME}' already exists (running or stopped). Please remove it or rename it before proceeding." 1
fi
echo "✅ '${CONTAINER_NAME}' is available for my container."

# .env
echo "🔍 Checking for .env.example file..."
if [ ! -f ".env.example" ]; then
    exit_helper "❌ .env.example is missing." 1
fi
echo "✅ .env.example is present."

echo "🔍 Checking for .env file..."
if [ ! -f ".env" ]; then
    echo "ℹ️  .env file is not found."
    echo "📋 Copying .env.example → .env..."
    cp .env.example .env
    echo "✅ .env created from .env.example."
fi
echo "✅ .env is present."

echo "🔍 Checking for package.json..."
if [ ! -f "package.json" ]; then
    exit_helper "❌ package.json is missing." 1
fi
echo "✅ package.json is present."

echo "📦 Installing Node.js dependencies..."
if ! npm install; then
    exit_helper "❌ Failed to install dependencies via npm." 1
fi
echo "✅ Success installing dependencies."

echo ""
echo "🎉 All prerequisites satisfied."
echo ""

# Setup
echo "🚀 Setting up PostgreSQL container..."
if ! docker compose -f docker-compose.yaml up -d --remove-orphans; then
    exit_helper "❌ Failed to start Docker containers." 1
fi
IS_CONTAINER_MADE=true
echo "✅ Success setup PostgreSQL container."

echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec "$CONTAINER_NAME" pg_isready -U "$POSTGRES_USER" >/dev/null 2>&1; do
    if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
        exit_helper "❌ PostgreSQL did not become ready in time." 1
    fi
    echo "⌛ Waiting for PostgreSQL to be ready..."
    RETRIES=$((RETRIES+1))
    sleep 1
done
echo "✅ PostgreSQL is ready."

# Prisma
echo "🔍 Checking if 'prisma' is found in package.json..."
if ! grep -q '"prisma"' package.json; then
    exit_helper "❌ 'prisma' not found in package.json. Please add it as a dependency." 1
fi
echo "✅ 'prisma' is found in package.json."

echo "🔄 Pushing Prisma schema with database..."
if ! npx prisma db push; then
    exit_helper "❌ Failed to push Prisma schema to the database." 1
fi
echo "✅ Success to push Prisma schema to the database."

echo "⚙️  Generating Prisma client..."
if ! npx prisma generate; then
    exit_helper "❌ Failed to generate Prisma client." 1
fi
echo "✅ Success to generate Prisma client."

echo "🔍 Checking if 'prisma/seed.ts' exists..."
if [ ! -f "prisma/seed.ts" ]; then
    exit_helper "❌ 'prisma/seed.ts' does not exist." 1
fi
echo "✅ 'prisma/seed.ts' exists."

echo "🌱 Seeding database with Prisma..."
if ! npx prisma db seed; then
    exit_helper "❌ Failed to seed the database with Prisma." 1
fi
echo "✅ Success to seed the database with Prisma."

# Final
echo ""
echo "========================="
echo "     Setup Completed     "
echo "========================="
echo ""

echo "🔍 Checking if 'dev' script exists..."
if ! npm run | grep -q 'dev'; then
    exit_helper "❌ 'dev' script does not exist." 1
fi
echo "✅ 'dev' script exists."

echo "🚀 Starting development server..."
npm run dev &
APP_PID=$!

echo "🔍 Checking if app is running..."
sleep 1
if ! kill -0 "$APP_PID" >/dev/null 2>&1; then
  exit_helper "❌ Failed to start dev server." 1
fi
echo "✅ App is running."

echo "👉 Press Ctrl C to stop the server"
echo "🌐 Visit http://localhost:3000"
echo ""

wait $APP_PID
