import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../messages/entities/message.entity';
/*
	Role of this chat service
	1. Connection between gateway and kafka
	2. Socket session management (current client sessions)
	3. Send a system message
*/

@Injectable()
export class ChatService {
  private redisClient: Redis;

  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = Number(process.env.REDIS_PORT) || 6379;
    console.log(`[ChatService] Connecting to Redis at ${redisHost}:${redisPort}`);
    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
    });
  }

  async addUser(userId: number, socketId: string) {
    // expires in 24 hours (86400 seconds)
    await this.redisClient.set(`user:session:${userId}`, socketId, 'EX', 86400);
    console.log(`User ${userId} added to session`);
  }

  async removeUser(userId: number) {
    await this.redisClient.del(`user:session:${userId}`);
    console.log(`User ${userId} removed from session`);
  }

  async getSocketId(userId: number): Promise<string | null> {
    return this.redisClient.get(`user:session:${userId}`);
  }

  async saveMessage(roomId: string | number, userId: number, content: string) {
    const messageData = {
      roomId,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
    };

    const redisKey = `chat:room:${roomId}:messages`;
    await this.redisClient.lpush(redisKey, JSON.stringify(messageData));
    await this.redisClient.ltrim(redisKey, 0, 99); // Keep only the latest 100 messages

    this.kafkaClient.emit('chat.message.create', messageData);

    console.log(`[Producer] Sent to Kafka & Redis: ${content}`);

    return {
      ...messageData,
      id: Date.now(),
      sender: { id: userId },
    };
  }

  async getMessages(roomId: number) {
    const redisKey = `chat:room:${roomId}:messages`;

    const cachedMessages = await this.redisClient.lrange(redisKey, 0, -1);

    if (cachedMessages.length > 0) {
      return cachedMessages.map((msg) => JSON.parse(msg)).reverse();
    } else {
      const messages = await this.messagesRepository.find({
        where: { room: { id: roomId } },
        relations: ['sender'],
        order: { createdAt: 'DESC' },
        take: 50,
      });

      return messages.reverse() || [];
    }
  }
}
