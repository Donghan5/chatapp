import { client } from '../../../lib/axios';
import type { ChatRoom, Message, SendMessageRequest } from '../types';

export const chatApi = {
	getRooms: async (): Promise<ChatRoom[]> => {
		const response = await client.get<ChatRoom[]>('/chat-rooms/my');
		return response.data;
	},

	getMessages: async (roomId: string): Promise<Message[]> => {
		const response = await client.get<Message[]>(`/messages?roomId=${roomId}`);
		return response.data;
	},

	sendMessages: async (data: SendMessageRequest): Promise<Message> => {
		const response = await client.post<Message>('/messages', data);
		return response.data;
	},

	createRoom: async (partenerId: string): Promise<ChatRoom> => {
		const response = await client.post<ChatRoom>('/chat-rooms', { partenerId });
		return response.data;
	}
}