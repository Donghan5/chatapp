import { WebSocketServer, WebSocket } from 'ws';
import kafka from './kafka';

const KAFKA_TOPIC = 'chat-messages';

export const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws: WebSocket) => {
	console.log('New client connected');

	ws.on('message', async(data) => {
		const messageString = data.toString();
		const message = JSON.parse(messageString);
		console.log(`Received message: ${message}`);

		if (message.type === 'joinRoom') {
			const { roomId } = message;
			if (!rooms.has(roomId)) {
				rooms.set(roomId, new Set());
			}
			rooms.get(roomId)?.add(ws);
			ws.send(JSON.stringify({ type: 'joinedRoom', roomId }));
		} else if (message.type === 'sendMessage') {
			try {
				await producer.send({
					topic: KAFKA_TOPIC,
					messages: [
						{ value: messageString }
					]
				});
			} catch (error) {
				console.error('Error sending message to Kafka:', error);
			}
		}
	});

	ws.on('close', () => {
		console.log('Client disconnected');
		rooms.forEach((clients, roomId) => {
			if(clients.has(ws)) {
				clients.delete(ws);
				if (clients.size === 0) {
					rooms.delete(roomId);
				}
			}
		});
	});

	ws.on('error', (error) => {
		console.error('WebSocket error:', error);
	});
});

const producer = kafka.producer();
const consumer = kafka.consumer({ 
	// in k8s environment, make sure the consumer group id is unique across the cluster (pod name)
	groupId: `messenger-realtime-group-${process.env.POD_NAME || 'local-dev'}`
});

const runConsumer = async () => {
	await consumer.connect();
	await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true })
	
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			if (!message.value) return;

			const chatMessageString = message.value.toString();
			const chatMessage = JSON.parse(chatMessageString);

			const {roomId} = chatMessage;

			const clientsInRoom = rooms.get(roomId);
			if (clientsInRoom) {
				clientsInRoom.forEach((client: WebSocket) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(chatMessageString);
					}
				})
			} else {
				console.log(`No clients in room ${roomId}`);
			}
		}
	});
}

const startWebSocketServer = async () => {
	await producer.connect();
	console.log('WebSocket server started on ws://localhost:8080');

	wss.on('connection', (ws: WebSocket) => {
		console.log('New client connected');

		ws.on('message', async (data) => {
			console.log(`Received message from client: ${data}`);

			const chatMessage = data.toString();
			// Send the message to Kafka
			try {
				await producer.send({
					topic: KAFKA_TOPIC,
					messages: [
						{ value: chatMessage }
					]
				});
			} catch (error) {
				console.error('Error sending message to Kafka:', error);
			}
		});

		ws.on('close', () => {
			console.log('Client disconnected');
		});

		ws.on('error', (error) => {
			console.error('WebSocket error:', error);
		});
	});
}

startWebSocketServer().catch(console.error);
runConsumer().catch(console.error);