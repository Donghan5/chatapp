import {
	SubscribeMessage,
	WebSocketGateway,
	MessageBody,
	ConnectedSocket,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ClientKafka } from '@nestjs/microservices';
import { WsJwtGuard } from 'src/auth/ws-jwt-guard';
import { CreateMessageDto } from '../messages/dto/create-messages.dto';
import { Inject } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageService } from '../messages/messages.service';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	// Map userId to socketId
	private connectedUsers = new Map<number, string>();

	constructor(
		private readonly chatService: ChatService,
		@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly messagesService: MessageService,
	) { }

	async handleConnection(client: Socket) {
		console.log(`Client ${client.id} connecting`);

		const token = this.extractToken(client);
		if (!token) {
			return client.disconnect();
		}

		try {
			const secret = this.configService.get<string>('JWT_SECRET');
			const payload = this.jwtService.verify(token, { secret });

			await this.chatService.addUser(payload.sub, client.id);

			client.data.user = payload;

			const userId = client.data.user.sub;

			this.connectedUsers.set(userId, client.id);
			this.server.emit('userStatus', { userId, status: 'online' });

			console.log(`User ${userId} is online`);
		} catch (error) {
			console.log(error);
			return client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client ${client.id} disconnecting`);
		if (client.data.user) {
			await this.chatService.removeUser(client.data.user.sub);
		}

		const userId = client.data.user?.sub;
		if (userId) {
			this.connectedUsers.delete(userId);
			this.server.emit('userStatus', { userId, status: 'offline' });
		}
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() roomId: number,
	) {
		const userId = client.data.user.sub;
		client.join(`room-${roomId}`);

		this.server.to(`room-${roomId}`).emit('messagesDelivered', {
			roomId,
			deliveredTo: userId,
		});

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

		this.kafkaClient.emit('chat.send', {
			roomId: payload.roomId,
			content: payload.content,
			senderId: user.sub,
			senderEmail: user.email,
		}).subscribe();

		const tempMessage = {
			content: payload.content,
			sender: { id: user.sub, email: user.email },
			createdAt: new Date(),
		};

		this.server.to(`room-${payload.roomId}`).emit('newMessage', tempMessage);
	}

	private extractToken(client: Socket): string | undefined {
		if (client.handshake.auth && client.handshake.auth.token) {
			return client.handshake.auth.token;
		}

		const authHandler = client.handshake.headers.authorization;
		if (authHandler) {
			return authHandler.split(' ')[1];
		}

		return undefined;
	}

	@SubscribeMessage('getOnlineUsers')
	handleGetOnlineUsers() {
		return Array.from(this.connectedUsers.keys());
	}

	@SubscribeMessage('typing')
	handleTyping(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: { roomId: number; isTyping: boolean },
	) {
		const user = client.data.user;

		client.to(`room-${payload.roomId}`).emit('userTyping', {
			userId: user.sub,
			userName: user.email?.split('@')[0] || 'someone',
			roomId: payload.roomId,
			isTyping: payload.isTyping,
		});
	}


	@SubscribeMessage('markAsRead')
	async handleMarkAsRead(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: { roomId: number; messageIds: number[] },
	) {
		const userId = client.data.user.sub;
		
		await this.messagesService.markAsRead(payload.messageIds);

		client.to(`room-${payload.roomId}`).emit('messagesRead', {
			roomId: payload.roomId,
			messageIds: payload.messageIds,
			readBy: userId,
		});
	}
}
