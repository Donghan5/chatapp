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

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly chatService: ChatService,
		@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
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
	}

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
}
