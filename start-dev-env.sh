#!/bin/bash
set -e

echo "🚀 Starting local development environment (No Zookeeper)..."

if [ "$(docker ps -aq -f name=pg-chatapp)" ]; then
    echo "♻️  Removing existing PostgreSQL container..."
    docker rm -f pg-chatapp > /dev/null
fi

echo "🐘 PostgreSQL running..."
docker run -d --name pg-chatapp \
  -e POSTGRES_USER=chatapp_user \
  -e POSTGRES_PASSWORD=chatapp_user_password \
  -e POSTGRES_DB=chatapp_db \
  -p 5432:5432 \
  postgres:15-alpine

if [ "$(docker ps -aq -f name=kafka)" ]; then
    echo "♻️  Removing existing Kafka container..."
    docker rm -f kafka > /dev/null
fi

echo "📦 Kafka (KRaft Mode) running..."
docker run -d --name kafka \
  -p 9092:9092 \
  -e KAFKA_CFG_NODE_ID=0 \
  -e KAFKA_CFG_PROCESS_ROLES=controller,broker \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@localhost:9093 \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  bitnamilegacy/kafka:3.7

echo "✅ Development environment started!"