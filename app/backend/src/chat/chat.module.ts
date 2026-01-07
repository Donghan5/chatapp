import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../messages/message.entity';
import { ChatRoom } from '../chat-rooms/chat-room.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, ChatRoom, User]),
    AuthModule
  ],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
