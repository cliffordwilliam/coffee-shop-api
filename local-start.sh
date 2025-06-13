#!/bin/bash

set -e

echo "🔄 Starting PostgreSQL container..."
sudo docker compose up -d db

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

echo "🚀 Pushing Prisma schema to the database..."
npx prisma db push

echo "✅ Local environment ready!"
