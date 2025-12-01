import { FastifyInstance } from 'fastify';
import { createChatRoom, getChatRooms, joinChatRoom } from '../../../chat/chat.room';
import jwt from 'jsonwebtoken';

export function chatRoomRoute(app: FastifyInstance) {
	const getUserFromToken = (req: any) => {
		const authHeader = req.headers.authorization;
		if (!authHeader) return null;

		try {
			const token = authHeader.split(' ')[1];
			const secret = process.env.JWT_SECRET;
			if (!secret) throw new Error('JWT_SECRET is not defined');
			const decoded = jwt.verify(token, secret) as any;
			return decoded;
		} catch (error) {
			console.error('Error verifying token:', error);
			return null;
		}
	}
	
	app.get('/rooms', async (req, reply) => {
		const user = getUserFromToken(req);
		if (!user) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}
		
		try {
			const rooms = await getChatRooms(user.id);
			return reply.send(rooms);
		} catch (error) {
			console.error('Error fetching chat rooms:', error);
			return reply.status(500).send({ error: 'Failed to fetch chat rooms' });
		}
	});

	app.post('/rooms', async (req: any, reply) => {
		const user = getUserFromToken(req);
		if (!user) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}
		
		try {
			const { name } = req.body;
			if (!name) {
				return reply.status(400).send({ error: 'Room name is required' });
			}
			const room = await createChatRoom(name, user.id);
			return reply.send(room);
		} catch (error) {
			console.error('Error creating chat room:', error);
			return reply.status(500).send({ error: 'Failed to create chat room' });
		}
	});

	app.post('/rooms/:id/join', async(req: any, reply) => {
		const user = getUserFromToken(req);
		if (!user) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}

		const roomId = Number(req.params.id);
		try {
			await joinChatRoom(user.id, roomId);
			return reply.send({ success: true });
		} catch (error) {
			console.error('Error joining chat room:', error);
			return reply.status(500).send({ error: 'Failed to join chat room' });
		}
	});
}