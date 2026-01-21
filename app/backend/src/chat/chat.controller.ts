import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from '../messages/entities/messages.entity';
import { User } from '../users/entities/user.entity';
import { ChatRoom } from '../chat-rooms/entities/chat-room.entity';

@Controller()
export class ChatController {
  constructor(
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
  ) {}

  @EventPattern('chat.message.create')
  async handleMessageCreate(@Payload() data: any) {
    console.log(`[Consumer] Received from Kafka: ${JSON.stringify(data)}`);

    const newMessage = this.messagesRepository.create({
      content: data.content,
      createdAt: data.createdAt,
      room: { id: data.roomId } as ChatRoom,
      sender: { id: data.senderId } as User,
    });

    await this.messagesRepository.save(newMessage);
    console.log(`[Consumer] Saved to DB! ID: ${newMessage.id}`);
  }
}

