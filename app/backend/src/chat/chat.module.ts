import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Message } from '../messages/entities/message.entity';
import { ChatRoom } from '../chat-rooms/entities/chat-room.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageModule } from '../messages/messages.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Message, ChatRoom, User]),
        AuthModule,
        MessageModule,
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'chat-app',
                            brokers: [configService.get('KAFKA_BROKERS') || 'localhost:9092'],
                        },
                        consumer: {
                            groupId: 'chat-producer-group',
                        },
                    },
                }),
            },
        ]),
    ],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
})
export class ChatModule { }
