#!/bin/bash
set -e

echo "--- Building PostgreSQL Database Docker Image ---"

docker build -t chatapp-db .

echo "--- Running PostgreSQL Database Container ---"

docker run --name pg-chatapp \
  -e POSTGRES_USER=chatapp_user \
  -e POSTGRES_PASSWORD=chatapp_user_password \
  -e POSTGRES_DB=chatapp_db \
  -p 5432:5432 \
  chatapp-db
