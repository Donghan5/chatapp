import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

/*
	Role of this chat service
	1. Connection between gateway and kafka
	2. Socket session management (current client sessions)
	3. Send a system message
*/

@Injectable()
export class ChatService {
	constructor(
		@Inject('REDIS_CLIENT') private readonly redis: Redis,
	) { }

	async addUser(userId: number, socketId: string) {
		// expires in 24 hours (86400 seconds)
		await this.redis.set(`user:session:${userId}`, socketId, 'EX', 86400);
		console.log(`User ${userId} added to session`);
	}

	async removeUser(userId: number) {
		await this.redis.del(`user:session:${userId}`);
		console.log(`User ${userId} removed from session`);
	}
	
	async getSocketId(userId: number): Promise<string | null> {
		return this.redis.get(`user:session:${userId}`);
	}
}
