#!/bin/bash

cleanup() {
  # Quit early, prevent multi callback
  if [ "$already_cleaned" = true ]; then
    return
  fi
  already_cleaned=true

  echo "🔴 Cleaning up..."

  # Kill app PID
  if [ -n "$APP_PID" ]; then
    echo "🔴 Stopping development server..."
    kill -TERM $APP_PID 2>/dev/null || true
  fi

  # Kill PostgreSQL container
  if sudo docker ps | grep -q "postgres"; then
    echo "🔴 Stopping PostgreSQL container..."
    sudo docker compose down
  fi

  echo "🧹 Cleanup completed."
  exit 0
}

# Run cleanup on exit package
trap cleanup SIGINT SIGTERM EXIT

echo "🔄 Starting PostgreSQL container..."
sudo docker compose up -d db

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

echo "🚀 Pushing Prisma schema to the database..."
npx prisma db push

echo "🚀 Seeding the database..."
npx prisma db seed

echo "🚀 Starting backend app..."
npm run dev &
APP_PID=$!

echo "✅ Local environment ready! Press Ctrl+C to stop."

# Wait indefinitely so script doesn’t exit immediately
wait $APP_PID
