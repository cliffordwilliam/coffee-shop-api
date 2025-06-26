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
print_banner "Dockerized Coffee Shop API"

# Mark env check
print_banner "Env Check"

# .env
exit_on_lie ".env.example is present" "[ -f ".env.example" ]"
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
exit_on_lie "DBMS_CONTAINER_NAME is set" '[ -n "$DBMS_CONTAINER_NAME" ]'
exit_on_lie "DB_USER (PostgreSQL user) is set" '[ -n "$DB_USER" ]'
exit_on_lie "MAX_RETRIES is a valid number" '[[ "$MAX_RETRIES" =~ ^[0-9]+$ ]]'
exit_on_lie "API_PREFIX is set and starts with '/'" '[[ "$API_PREFIX" == /* ]]'

# Container values
exit_on_lie "CUSTOM_NETWORK_NAME is set" '[ -n "$CUSTOM_NETWORK_NAME" ]'
exit_on_lie "BE_APP_CONTAINER_NAME is set" '[ -n "$BE_APP_CONTAINER_NAME" ]'
exit_on_lie "FULL_YAML file exists" '[ -f "$FULL_YAML" ]'

# Prisma
exit_on_lie "PRISMA_SEED_FILE_PATH exists" '[ -f "$PRISMA_SEED_FILE_PATH" ]'
exit_on_lie "PRISMA_SEED_SCRIPT_NAME is set" '[ -n "$PRISMA_SEED_SCRIPT_NAME" ]'

# package.json scripts
exit_on_lie "PACKAGE_JSON_DEV_SCRIPT_NAME is set" '[ -n "$PACKAGE_JSON_DEV_SCRIPT_NAME" ]'


# Constants
DBMS_CONTAINER_NAME="${DBMS_CONTAINER_NAME}"
BE_APP_CONTAINER_NAME="${BE_APP_CONTAINER_NAME}"
FULL_YAML="${FULL_YAML}"
DB_USER="${DB_USER}"
IS_DB_CONTAINER_MADE=false
IS_APP_CONTAINER_MADE=false
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
⚠️  This app uses Docker containers named "${DBMS_CONTAINER_NAME}" and "${BE_APP_CONTAINER_NAME}" on a custom network named "${CUSTOM_NETWORK_NAME}".
   If a container with those names is already running (even stopped), this script will fail.
   This script will create fresh BE App and DBMS containers with new migrations and seed data without volume.

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

    exit_on_lie "Docker is installed" "command -v docker >/dev/null 2>&1"

    echo "🔍 Checking if I made my BE App container..."
    if [ "$IS_APP_CONTAINER_MADE" = true ]; then
        echo "🛑 Killing my running '${BE_APP_CONTAINER_NAME}' BE App container..."
        docker stop "$BE_APP_CONTAINER_NAME" >/dev/null 2>&1 || true
        docker rm "$BE_APP_CONTAINER_NAME" >/dev/null 2>&1 || true
    else
        echo "ℹ️  I have not made my BE App container."
    fi

    echo "🔍 Checking if I made my DBMS container..."
    if [ "$IS_DB_CONTAINER_MADE" = true ]; then
        echo "🛑 Killing my running '${DBMS_CONTAINER_NAME}' DBMS container..."
        docker stop "$DBMS_CONTAINER_NAME" >/dev/null 2>&1 || true
        docker rm "$DBMS_CONTAINER_NAME" >/dev/null 2>&1 || true
    else
        echo "ℹ️  I have not made my DBMS container."
    fi

    echo "🔍 Checking if custom Docker network '${CUSTOM_NETWORK_NAME}' exists..."
    if docker network inspect "${CUSTOM_NETWORK_NAME}" >/dev/null 2>&1; then
        echo "🧹 Removing custom Docker network '${CUSTOM_NETWORK_NAME}'..."
        docker network rm "${CUSTOM_NETWORK_NAME}" >/dev/null 2>&1 || true
    else
        echo "ℹ️  Custom network '${CUSTOM_NETWORK_NAME}' not found or already removed."
    fi

    exit_helper "✅ Cleanup complete." 0
}

# Cleanup on these signals
trap 'cleanup; exit $?' SIGINT SIGTERM EXIT

# Mark prerequisite checks
print_banner "Checking Prerequisites"

# jq: to check for texts in files (dev string exists in package.json)
exit_on_lie "jq is installed" "command -v jq >/dev/null 2>&1"

# Docker
exit_on_lie "Docker is installed" "command -v docker >/dev/null 2>&1"
exit_on_lie "Docker is running" "docker info >/dev/null 2>&1"
exit_on_lie "Docker Compose is available" "docker compose version >/dev/null 2>&1"

# Database and app container
exit_on_lie "'$FULL_YAML' exists" "[ -f \"$FULL_YAML\" ]"
exit_on_lie "No existing '${DBMS_CONTAINER_NAME}' container found" "! docker container inspect \"$DBMS_CONTAINER_NAME\" >/dev/null 2>&1"
exit_on_lie "No existing '${BE_APP_CONTAINER_NAME}' container found" "! docker container inspect \"$BE_APP_CONTAINER_NAME\" >/dev/null 2>&1"
exit_on_lie "No existing '${CUSTOM_NETWORK_NAME}' network found" "! docker network inspect \"$CUSTOM_NETWORK_NAME\" >/dev/null 2>&1"

# Check local files for App Container: Prisma & package.json
# I decided not to check what seeds are inside, just if the seed file is there
exit_on_lie "'${PRISMA_SEED_FILE_PATH}' exists" "[ -f '${PRISMA_SEED_FILE_PATH}' ]"
exit_on_lie "\"${PRISMA_SEED_SCRIPT_NAME}\" script exists in package.json" "jq -e '.prisma[\"${PRISMA_SEED_SCRIPT_NAME}\"]' package.json >/dev/null 2>&1"
# I decided not to check what deps are inside, just if the package.json file is there
exit_on_lie "package.json is present" "[ -f 'package.json' ]"
exit_on_lie "\"${PACKAGE_JSON_DEV_SCRIPT_NAME}\" script exists in package.json" "jq -e '.scripts[\"${PACKAGE_JSON_DEV_SCRIPT_NAME}\"]' package.json >/dev/null 2>&1"


# Mark start both containers
print_banner "Starting DBMS Container & BE App Container"

# Compose up DBMS container
exit_on_lie "Docker compose is up" "docker compose -f "$FULL_YAML" up -d --build postgres --remove-orphans"
IS_DB_CONTAINER_MADE=true
wait_for_ready "PostgreSQL" "docker exec $DBMS_CONTAINER_NAME pg_isready -U $DB_USER"

# Compose up BE App Container
exit_on_lie "Docker compose is up" "docker compose -f "$FULL_YAML" up -d --build app --remove-orphans"
IS_APP_CONTAINER_MADE=true

# Prisma in BE App Container
exit_on_lie "BE App Container Prisma CLI is available" "docker exec "$BE_APP_CONTAINER_NAME" npx prisma -v >/dev/null 2>&1"
exit_on_lie "BE App Container Prisma schema is pushed to DBMS Container" "docker exec "$BE_APP_CONTAINER_NAME" npx prisma db push"
exit_on_lie "BE App Container Prisma client is generated" "docker exec "$BE_APP_CONTAINER_NAME" npx prisma generate"
exit_on_lie "DBMS Container is seeded by BE App Container" "docker exec "$BE_APP_CONTAINER_NAME" npx prisma db seed"

# Mark Start BE App Container & DBMS Container
print_banner "BE App Container & DBMS Container are ready"
echo "👉 Press Ctrl C to stop the server"
echo "🌐 Visit http://localhost:${PORT}${API_PREFIX}"

# Wait to keep logs visible
docker compose -f "$FULL_YAML" logs -f & LOG_PID=$!
wait $LOG_PID
