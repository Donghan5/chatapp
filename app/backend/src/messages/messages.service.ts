import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Message, MessageStatus } from './entities/messages.entity';
import { CreateMessageDto } from './dto/create-messages.dto';
import { ChatRoom } from '../chat-rooms/entities/chat-room.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  async saveMessage(
    content: string,
    roomId: number,
    senderId: number,
  ): Promise<Message> {
    const newMessage = this.messageRepository.create({
      content,
      room: { id: roomId } as ChatRoom,
      sender: { id: senderId } as User,
    });

    return this.messageRepository.save(newMessage);
  }

  async getMessages(roomId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { room: { id: roomId } },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getMessagesByRoom(
    roomId: number,
    cursor: number | undefined,
    limit: number,
  ) {
    const query = this.messageRepository
      .createQueryBuilder('message')
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

    message.status = MessageStatus.DELETED;
    await this.messageRepository.save(message);
  }

  async markAsDelivered(messageIds: number[]): Promise<void> {
    await this.messageRepository.update(
      { id: In(messageIds), status: MessageStatus.SENT },
      { status: MessageStatus.DELIVERED, deliveredAt: new Date() }
    );
  }

  async markAsRead(messageIds: number[]): Promise<void> {
    await this.messageRepository.update(
      { id: In(messageIds), status: Not(MessageStatus.READ) },
      { status: MessageStatus.READ, readAt: new Date() }
    );
  }

  async searchMessages(userId: number, query: string, roomId?: number): Promise<Message[]> {
    const qb = this.messageRepository.createQueryBuilder('msg')
      .innerJoin('msg.room', 'room')
      .innerJoin('room.participants', 'p', 'p.userId = :userId', { userId })
      .where("msg.search_vector @@ plainto_tsquery('english', :query)", { query })
      .orderBy("ts_rank(msg.search_vector, plainto_tsquery('english', :query))", 'DESC')
      .addOrderBy('msg.createdAt', 'DESC')
      .take(50);

    if (roomId) {
      qb.andWhere('msg.roomId = :roomId', { roomId });
    }

    return qb.getMany();
  }


  async editMessage(userId: number, messageId: number, newContent: string): Promise<Message> {
      const message = await this.messageRepository.findOne({
          where: { id: messageId, senderId: userId },
      });

      if (!message) {
          throw new NotFoundException('Message not found or you are not the sender');
      }

      message.content = newContent;
      // searchVector will be updated by the trigger
      return this.messageRepository.save(message);
  }
}

