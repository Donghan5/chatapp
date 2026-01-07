import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../messages/message.entity';
import { ChatRoom } from '../chat-rooms/chat-room.entity';
import { User } from '../users/user.entity';
import { RoomParticipant } from 'src/chat-rooms/room-participant.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
		@InjectRepository(ChatRoom)
		private chatRoomsRepository: Repository<ChatRoom>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(RoomParticipant)
		private participantsRepository: Repository<RoomParticipant>,
	) {}

	async saveMessage(content: string, roomId: number, senderId: number): Promise<Message> {
		const newMessage = this.messagesRepository.create({
			content,
			room: { id: roomId } as ChatRoom,
			sender: { id: senderId } as User,
		});

		return this.messagesRepository.save(newMessage);
	}

	async getMyChatRooms(userId: number) {
		return this.chatRoomsRepository.createQueryBuilder('room')
			.innerJoin('room.participants', 'participant')
			.leftJoinAndSelect('room.messages', 'message')
			.where('participant.user_id = :userId', { userId })
			.orderBy('room.lastMessageAt', 'DESC')
			.getMany();
	}

	async getMessages(roomId: number): Promise<Message[]> {
		return this.messagesRepository.find({
			where: { room: { id: roomId } },
			relations: ['sender'],
			order: { createdAt: 'DESC' },
			take: 50,
		});
	}

	async markAsRead(userId: number, roomId: number) {
		await this.participantsRepository.update(
			{ userId, roomId },
			{ lastReadAt: new Date() },
		);
	}
}
