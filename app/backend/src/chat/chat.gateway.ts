import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ClientKafka } from '@nestjs/microservices';
import { WsJwtGuard } from 'src/auth/ws-jwt-guard';
import { CreateMessageDto } from '../messages/message.dto';
import { Inject } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	namespace: 'chat',
})
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly chatService: ChatService,
		@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
	) { }

	@SubscribeMessage('joinRoom')
	handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() roomId: number,
	) {
		client.join(`room-${roomId}`);
		console.log(`Client: ${client.id} joined room ${roomId}`);

		return { event: 'joinedRoom', roomId };
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() roomId: number,
	) {
		client.leave(`room-${roomId}`);
		console.log(`Client: ${client.id} left room ${roomId}`);

		return { event: 'leftRoom', roomId };
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMessage')
	async handleMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: { roomId: number; content: string },
	) {
		const user = client.data.user;

		this.kafkaClient.send('chat.send', {
			roomId: payload.roomId,
			content: payload.content,
			senderId: user.sub,
			senderEmail: user.email,
		});

		const tempMessage = {
			content: payload.content,
			sender: { id: user.sub, email: user.email },
			createdAt: new Date(),
		};
		this.server.to(`room-${payload.roomId}.emit('newMessage', tempMessage)`);
	}
}
