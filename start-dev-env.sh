#!/bin/bash
set -e

echo "🚀 Starting local development environment..."

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

if [ "$(docker ps -aq -f name=redis)" ]; then
    echo "♻️  Removing existing Redis container..."
    docker rm -f redis > /dev/null
fi

echo "🔺 Redis running..."
docker run -d --name redis \
  -p 6379:6379 \
  redis:alpine

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
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true \
  bitnamilegacy/kafka:3.7

echo "⏳ Waiting for Kafka to be ready (10s)..."
sleep 10  # Kafka 부팅 대기

echo "🔨 Creating Kafka topics..."

docker exec kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create \
  --topic chat.message.create \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1 || echo "⚠️ Topic 'chat.message.create' already exists or Kafka not ready."

docker exec kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create \
  --topic chat.send \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1 || echo "⚠️ Topic 'chat.send' already exists or Kafka not ready."

echo "✅ All services & topics started! (Postgres, Redis, Kafka)"
