FROM confluentinc/cp-kafka:latest

EXPOSE 9092 29092


HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD kafka-broker-api-versions --bootstrap-server localhost:9092 || exit 1