#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Color codes
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m' # No Color

# Helpers
exit_helper() {
    local exit_message="$1"
    local exit_code="$2"
    printf "${YELLOW}ℹ️  Exiting...${NC}\n"
    if [ "$exit_code" -eq 0 ]; then
        printf "${GREEN}%s${NC}\n" "$exit_message"
    else
        printf "${RED}%s${NC}\n" "$exit_message"
    fi
    exit "$exit_code"
}

exit_on_lie() {
    local action_name="$1"
    local condition="$2"
    printf "${YELLOW}🔍 %-15s${NC} %s\n" "Statement:" "$action_name"
    if ! eval "$condition"; then
        printf "${RED}❌ %-15s${NC}\n" "Lie"
        exit_helper "Lie: $action_name" 1
    fi
    printf "${GREEN}✅ %-15s${NC}\n" "True"
}

print_banner() {
  local text="$1"
  local padding=5
  local text_length=${#text}
  local total_width=$((text_length + 2 * padding))
  local border_line=$(printf '=%.0s' $(seq 1 "$total_width"))
  local padding_spaces=$(printf ' %.0s' $(seq 1 "$padding"))
  echo "$border_line"
  echo "${padding_spaces}${text}${padding_spaces}"
  echo "$border_line"
}

# Mark welcome banner
print_banner "Coffee Shop API"

# Mark env check
print_banner "Env Check"

# .env
exit_on_lie ".env.example is present" "[ -f ".env.example" ]"
# I decided not to check what vars are inside, just if the .env.example file is there
echo "🔍 Checking for .env file..."
if [ ! -f ".env" ]; then
    echo "ℹ️  .env file is not found."
    echo "📋 Copying .env.example → .env..."
    cp .env.example .env
    echo "✅ .env created from .env.example."
fi
echo "✅ .env is present."

set -a
source .env
set +a

print_banner "Validating .env Variables"

# Basic validations
exit_on_lie "NVM_DIR is set and is a valid directory" '[ -d "$NVM_DIR" ]'
exit_on_lie "NODE_REQUIRED_MAJOR is a valid number" '[[ "$NODE_REQUIRED_MAJOR" =~ ^[0-9]+$ ]]'
exit_on_lie "DBMS_CONTAINER_NAME is set" '[ -n "$DBMS_CONTAINER_NAME" ]'
exit_on_lie "REGULAR_YAML file is set and exists" '[ -f "$REGULAR_YAML" ]'
exit_on_lie "DB_USER (PostgreSQL user) is set" '[ -n "$DB_USER" ]'
exit_on_lie "MAX_RETRIES is a valid number" '[[ "$MAX_RETRIES" =~ ^[0-9]+$ ]]'
exit_on_lie "LOCALHOST is set" '[ -n "$LOCALHOST" ]'
exit_on_lie "PROTOCOL is set" '[ -n "$PROTOCOL" ]'
exit_on_lie "PORT is a valid port number" '[[ "$PORT" =~ ^[0-9]+$ && "$PORT" -ge 1 && "$PORT" -le 65535 ]]'
exit_on_lie "API_PREFIX is set and starts with '/'" '[[ "$API_PREFIX" == /* ]]'

# Prisma
exit_on_lie "PRISMA_SEED_FILE_PATH exists" '[ -f "$PRISMA_SEED_FILE_PATH" ]'
exit_on_lie "PRISMA_SEED_SCRIPT_NAME is set" '[ -n "$PRISMA_SEED_SCRIPT_NAME" ]'

# package.json scripts
exit_on_lie "PACKAGE_JSON_DEV_SCRIPT_NAME is set" '[ -n "$PACKAGE_JSON_DEV_SCRIPT_NAME" ]'

# Constants
NVM_DIR="$NVM_DIR"
NODE_REQUIRED_MAJOR=${NODE_REQUIRED_MAJOR}
DBMS_CONTAINER_NAME="${DBMS_CONTAINER_NAME}"
REGULAR_YAML="${REGULAR_YAML}"
DB_USER="${DB_USER}"
IS_CONTAINER_MADE=false
MAX_RETRIES=${MAX_RETRIES}

wait_for_ready() {
  local name="$1"
  local cmd="$2"
  local retries=0
  local max_retries="${3:-$MAX_RETRIES}"
  until eval "$cmd"; do
    if [ "$retries" -ge "$max_retries" ]; then
      exit_helper "❌ $name did not become ready in time." 1
    fi
    echo "⌛ Waiting for $name... (attempt $((retries+1))/$max_retries)"
    retries=$((retries+1))
    sleep 1
  done
  echo "✅ $name is ready!"
}

# Early notice
cat <<EOF
⚠️  This script uses a Docker container named "${DBMS_CONTAINER_NAME}" for its database.
   If a container with that name is already running (even stopped), this script will fail.
   This script will create a fresh DBMS container with new migrations and seed data without volume.

   👉 Press Enter to continue, or Ctrl C to cancel and check your running containers.
EOF
read

# Cleanup
IS_CLEAN_UP_RAN=false
cleanup() {
    # Avoid running twice
    if [ "$IS_CLEAN_UP_RAN" = true ]; then
    	return
    fi
    IS_CLEAN_UP_RAN=true
    
    # Mark clean up
    print_banner "Cleaning Up"

    # Kill app at host port
    echo "🔍 Checking for my running local host BE App..."
    if [ -n "$APP_PID" ]; then
    	echo "🔴 Stopping my local host BE App..."
        kill -- -"$APP_PID" 2>/dev/null || true
        unset APP_PID
    fi
    echo "✅ My local host BE App stopped."

    exit_on_lie "Docker is installed" "command -v docker >/dev/null 2>&1"

    # Kill my DBMS container
    echo "🔍 Checking if I made my DBMS container..."
    if [ "$IS_CONTAINER_MADE" = true ]; then
        echo "🛑 Killing my running '${DBMS_CONTAINER_NAME}' DBMS container..."
        docker stop "$DBMS_CONTAINER_NAME" >/dev/null 2>&1 || true
        docker rm "$DBMS_CONTAINER_NAME" >/dev/null 2>&1 || true
    fi
    echo "ℹ️  I have not made my '${DBMS_CONTAINER_NAME}' DBMS container or I had killed it."
    
    exit_helper "✅ Cleanup complete." 0
}

# Cleanup on these signals
trap 'cleanup; exit $?' SIGINT SIGTERM EXIT ERR

# Mark prerequisite checks
print_banner "Checking Prerequisites"

# jq: to check for texts in files (dev string exists in package.json)
exit_on_lie "jq is installed" "command -v jq >/dev/null 2>&1"

# Docker
exit_on_lie "Docker is installed" "command -v docker >/dev/null 2>&1"
exit_on_lie "Docker is running" "docker info >/dev/null 2>&1"
exit_on_lie "Docker Compose is available" "docker compose version >/dev/null 2>&1"

# Node.js
exit_on_lie "Node.js is found" "command -v node >/dev/null 2>&1"
echo "ℹ️  Getting Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d '.' -f 1)
echo "🔍 Checking if Node.js version is above v$NODE_REQUIRED_MAJOR..."
if [ "$NODE_MAJOR_VERSION" -lt "$NODE_REQUIRED_MAJOR" ]; then
    exit_helper "❌ Node.js $NODE_VERSION too old. Please upgrade to v$NODE_REQUIRED_MAJOR." 1
fi
echo "✅ Node.js version is above v$NODE_REQUIRED_MAJOR: $(node -v)"

# NVM
exit_on_lie "NVM installed at $NVM_DIR" "[ -f \"$NVM_DIR/nvm.sh\" ]"
echo "ℹ️  Sourcing NVM command..."
source "$NVM_DIR/nvm.sh"
exit_on_lie "NVM command is found after sourcing" "command -v nvm >/dev/null 2>&1"
exit_on_lie "Connected to the internet" "curl -s --head https://registry.npmjs.org | grep HTTP >/dev/null"
nvm install "$NODE_REQUIRED_MAJOR"
exit_on_lie "nvm install succeeded" "[ $? -eq 0 ]"
exit_on_lie "Switched to Node.js v$NODE_REQUIRED_MAJOR" "nvm use "$NODE_REQUIRED_MAJOR""

# npm
exit_on_lie "npm is available" "command -v npm >/dev/null 2>&1"
# I decided not to check what deps are inside, just if the package.json file is there
exit_on_lie "package.json is present" "[ -f "package.json" ]"
exit_on_lie "Dependencies installed" "npm install"

# Mark DBMS Docker
print_banner "Starting DBMS container & Prisma"

# Database container
exit_on_lie "No existing '${DBMS_CONTAINER_NAME}' DBMS container found" "! docker container inspect \"$DBMS_CONTAINER_NAME\" >/dev/null 2>&1"
exit_on_lie "${REGULAR_YAML} exists" "[ -f "$REGULAR_YAML" ]"
exit_on_lie "Docker compose is up" "docker compose -f "$REGULAR_YAML" up -d --remove-orphans"
IS_CONTAINER_MADE=true
wait_for_ready "PostgreSQL" "docker exec $DBMS_CONTAINER_NAME pg_isready -U $DB_USER"
echo "✅ PostgreSQL is ready."

# Prisma
exit_on_lie "Prisma CLI is available" "npx --yes prisma --version >/dev/null 2>&1"
# I decided not to check if the content of schema file and seed file is valid or not
exit_on_lie "Prisma schema is pushed to database" "npx prisma db push"
exit_on_lie "Prisma client is generated" "npx prisma generate"
exit_on_lie "'${PRISMA_SEED_FILE_PATH}' exists" "[ -f \"${PRISMA_SEED_FILE_PATH}\" ]"
exit_on_lie "\"${PRISMA_SEED_SCRIPT_NAME}\" script exists in package.json" "jq -e '.prisma[\"${PRISMA_SEED_SCRIPT_NAME}\"]' package.json >/dev/null 2>&1"
exit_on_lie "Database is seeded" "npx prisma db seed"

# Mark Start BE App on host port
print_banner "Starting BE App on Host Port"
exit_on_lie "\"${PACKAGE_JSON_DEV_SCRIPT_NAME}\" script exists in package.json" "jq -e '.scripts[\"${PACKAGE_JSON_DEV_SCRIPT_NAME}\"]' package.json >/dev/null 2>&1"
exit_on_lie "Port ${PORT} is free" "! lsof -i :${PORT} >/dev/null 2>&1"
npm run dev & 
APP_PID=$!
# Wait until the app responds on port ${PORT} or timeout after 10 seconds
wait_for_ready "Local App" "curl -s ${PROTOCOL}://${LOCALHOST}:${PORT}${API_PREFIX} >/dev/null"
exit_on_lie "BE App is running" "lsof -i :${PORT} >/dev/null 2>&1"
echo "👉 Press Ctrl C to stop the server"
echo "🌐 Visit ${PROTOCOL}://${LOCALHOST}:${PORT}${API_PREFIX}"
wait $APP_PID
