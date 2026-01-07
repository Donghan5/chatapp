import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Message } from '../messages/message.entity';
import { ChatRoom } from '../chat-rooms/chat-room.entity';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, ChatRoom, User]),
    AuthModule,
    // ✅ Kafka 클라이언트 등록 (Producer 역할)
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'chat-app',
            brokers: ['localhost:9092'], // Kafka 브로커 주소 (환경변수로 빼는 것 권장)
          },
          consumer: {
            groupId: 'chat-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [ChatController], // ✅ Kafka 메세지를 받을 컨트롤러 등록
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}