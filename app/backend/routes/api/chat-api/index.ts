import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';
import { connectKafka, runConsumer, sendMessage } from '../../../kafka/index';
import { chatRoomRoute } from './room';
import { saveMessage } from '../../../chat/chat.message';

interface ChatMessage {
    type: 'message' | 'joinRoom' | 'joinedRoom';
    roomId: string;
    senderId?: number;
    content?: string;
}

const rooms = new Map<string, Set<WebSocket>>();

export default async function chatRoute(app: FastifyInstance) {
    await connectKafka();

    await runConsumer(async (message: ChatMessage) => {
        const { roomId, senderId, content, type } = message;
        const clientsInRoom = rooms.get(roomId);

		// save messages
		if (type === 'message' && senderId && content) {
			try {
				await saveMessage(content, senderId, Number(roomId));	
			} catch (error) {
				console.error('Error saving message:', error);
			}
		}

        if (clientsInRoom) {
            const messageString = JSON.stringify(message);
            clientsInRoom.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(messageString);
                }
            });
        }
    });

	app.register(chatRoomRoute, { prefix: '/api/chat' });

    app.get('/ws/chat', { websocket: true }, (connection, req) => {
        const socket = connection.socket;
        let currentRoomId: string | null = null;

        console.log('Client connected to WebSocket');

        socket.on('message', async (data: Buffer) => {
            try {
                const messageString = data.toString();
                const parsedMessage: ChatMessage = JSON.parse(messageString);

                if (parsedMessage.type === 'joinRoom') {
                    currentRoomId = parsedMessage.roomId;
                    if (!rooms.has(currentRoomId)) {
                        rooms.set(currentRoomId, new Set());
                    }
                    rooms.get(currentRoomId)?.add(socket);
                    
                    socket.send(JSON.stringify({ 
                        type: 'joinedRoom', 
                        roomId: currentRoomId 
                    }));
                    
                    console.log(`Client joined room: ${currentRoomId}`);

                } else if (parsedMessage.type === 'message') {
                    console.log(`Sending message to Kafka: ${messageString}`);
                    await sendMessage(parsedMessage);
                }

            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        });

        socket.on('close', () => {
            console.log('Client disconnected');
            if (currentRoomId && rooms.has(currentRoomId)) {
                const roomClients = rooms.get(currentRoomId);
                roomClients?.delete(socket);
                if (roomClients?.size === 0) {
                    rooms.delete(currentRoomId);
                }
            }
        });

        socket.on('error', (err) => {
            console.error('WebSocket error:', err);
        });
    });
}