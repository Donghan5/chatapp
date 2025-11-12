import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

import localApiRoute from './routes/api/login-api/local-api';
app.use('/api/auth/local', localApiRoute);

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST']
	}
});

io.on('connection', (socket) => {
	console.log('a user connected:', socket.id);

	socket.on('disconnect', () => {
		console.log('user disconnected:', socket.id);
	});

	socket.on('joinRoom', (roomId: string) => {
		socket.join(roomId);
		console.log(`User ${socket.id} joined room ${roomId}`);
		socket.emit('joinedRoom', roomId);
	});

	socket.on('sendMessage', (data: { roomId: string; message: string; senderId: number }) => {
		const { roomId, message, senderId } = data;
		console.log(`Message from ${senderId} to room ${roomId}: ${message}`);
		
		// 1 step. auth, senderId === socket.data.user.id
		// 2 step. save message to DB (not implemented here)
		// 3 kafka producer (not implemented here)
		
		io.to(roomId).emit('newMessage', { message, senderId });
	});
});

const PORT = process.env.BACKEND_PORT || 3000;
httpServer.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});