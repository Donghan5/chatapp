import { Kafka } from 'kafkajs';

// Kafka client configuration
// in k8s environment, the broker address is 'kafka:9092' (inner cluster DNS)
const kafka = new Kafka({
	clientId: 'messager-app',
	brokers: ['kafka:9092'],
});

export default kafka;