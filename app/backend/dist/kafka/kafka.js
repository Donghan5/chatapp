"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
// Kafka client configuration
// in k8s environment, the broker address is 'kafka:9092' (inner cluster DNS)
const kafka = new kafkajs_1.Kafka({
    clientId: 'messager-app',
    brokers: ['kafka:9092'],
});
exports.default = kafka;
