import { EachMessagePayload } from 'kafkajs';
import kafka from './kafka';

const KAFKA_TOPIC = 'chat-messages';

const producer = kafka.producer();
const consumer = kafka.consumer({ 
    groupId: `messenger-realtime-group-${process.env.POD_NAME || 'local-dev'}`
});

let isConnected = false;

export const connectKafka = async () => {
    if (isConnected) return;
    
    try {
        await producer.connect();
        await consumer.connect();
        await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });
        isConnected = true;
        console.log('✅ Kafka connected');
    } catch (error) {
        console.error('❌ Error connecting to Kafka:', error);
    }
};

export const sendMessage = async (message: any) => {
    if (!isConnected) {
        await connectKafka();
    }
    try {
        await producer.send({
            topic: KAFKA_TOPIC,
            messages: [
                { value: JSON.stringify(message) }
            ]
        });
    } catch (error) {
        console.error('❌ Error sending message to Kafka:', error);
    }
};

export const runConsumer = async (onMessageReceived: (message: any) => void) => {
    if (!isConnected) {
        await connectKafka();
    }
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
            if (!message.value) return;

            try {
                const messageString = message.value.toString();
                const parsedMessage = JSON.parse(messageString);
                onMessageReceived(parsedMessage);
            } catch (error) {
                console.error('❌ Error parsing Kafka message:', error);
            }
        }
    });
};