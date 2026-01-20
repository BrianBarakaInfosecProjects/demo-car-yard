#!/bin/sh
set -e

# Wait for database
echo "Waiting for database..."
until pg_isready -h postgres -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - applying migrations"
npx prisma migrate deploy

echo "Seeding database"
npx prisma db seed

echo "Starting server"
node dist/server.js
