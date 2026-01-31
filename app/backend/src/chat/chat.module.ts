import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Message } from '../messages/entities/messages.entity';
import { ChatRoom } from '../chat-rooms/entities/chat-room.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from '../messages/messages.module';
@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Message, ChatRoom, User]),
        AuthModule,
        MessageModule,
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'chat-app',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'chat-producer-group',
                    },
                },
            },
        ]),
    ],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
})
export class ChatModule { }
