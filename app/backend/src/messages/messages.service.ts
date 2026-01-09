import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Messages } from "./messages.entity";
import { CreateMessageDto } from "./create-messages.dto";
import { ChatRoom } from "../chat-rooms/chat-room.entity";
import { User } from "../users/user.entity";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Messages)
		private messageRepository: Repository<Messages>,
	) { }

	async createMessage(createMessageDto: CreateMessageDto) {
		const message = this.messageRepository.create(createMessageDto);
		return this.messageRepository.save(message);
	}

	async saveMessage(content: string, roomId: number, senderId: number): Promise<Messages> {
		const newMessage = this.messageRepository.create({
			content,
			room: { id: roomId } as ChatRoom,
			sender: { id: senderId } as User,
		});

		return this.messageRepository.save(newMessage);
	}

	async getMessages(roomId: number): Promise<Messages[]> {
		return this.messageRepository.find({
			where: { room: { id: roomId } },
			relations: ['sender'],
			order: { createdAt: 'DESC' },
			take: 50,
		});
	}

	async getMessagesByRoom(roomId: number, cursor: number | undefined, limit: number) {
		const query = this.messageRepository.createQueryBuilder('message')
			.leftJoinAndSelect('message.sender', 'sender')
			.where('message.roomId = :roomId', { roomId })
			.andWhere('message.isDeleted = false')
			.orderBy('message.createdAt', 'DESC')
			.take(limit);

		if (cursor) {
			query.andWhere('message.id < :cursor', { cursor });
		}

		const messages = await query.getMany();

		return {
			data: messages.reverse(),
			nextCursor: messages.length > 0 ? messages[messages.length - 1].id : null,
		};
	}

	async deleteMessage(userId: number, messageId: number) {
		const message = await this.messageRepository.findOne({
			where: { id: messageId },
			relations: ['sender'],
		});

		if (!message) {
			throw new NotFoundException('Message not found');
		}

		if (message.sender.id !== userId) {
			throw new UnauthorizedException('You can only delete your own message');
		}

		message.isDeleted = true;
		await this.messageRepository.save(message);
	}
}