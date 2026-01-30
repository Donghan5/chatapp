import { client } from "../../../lib/axios";
import type { ChatRoom, Message, SendMessageRequest } from "../types";

export const chatApi = {
    getRooms: async (): Promise<ChatRoom[]> => {
        const response = await client.get<ChatRoom[]>("/chat-rooms/my");
        return response.data;
    },

    getMessages: async (roomId: string): Promise<Message[]> => {
        const response = await client.get<Message[]>(`/messages?roomId=${roomId}`);
        return response.data;
    },

    sendMessages: async (data: SendMessageRequest): Promise<Message> => {
        const response = await client.post<Message>("/messages", data);
        return response.data;
    },

    createRoom: async (
        name: string,
        isGroup: boolean = false,
        inviteUserIds: number[] = [],
    ): Promise<ChatRoom> => {
        const response = await client.post<ChatRoom>("/chat-rooms", {
            name,
            isGroup,
            inviteUserIds,
        });
        return response.data;
    },

    createOrGetDM: async (targetUserId: number): Promise<ChatRoom> => {
        const response = await client.post<ChatRoom>("/chat-rooms/dm", {
            targetUserId,
        });
        return response.data;
    },

    getRoom: async (roomId: string): Promise<ChatRoom> => {
        const response = await client.get<ChatRoom>(`/chat-rooms/${roomId}`);
        return response.data;
    },
    
    addParticipant: async (roomId: string, userId: number): Promise<void> => {
        await client.post(`/chat-rooms/${roomId}/participants`, { userId });
    },

    removeParticipant: async (roomId: string, userId: number): Promise<void> => {
        await client.delete(`/chat-rooms/${roomId}/participants/${userId}`);
    },

    updateRoomName: async (roomId: string, name: string): Promise<void> => {
        await client.put(`/chat-rooms/${roomId}`, { name });
    },

    updateParticipantRole: async (roomId: string, userId: number, role: 'admin' | 'user'): Promise<void> => {
        await client.patch(`/chat-rooms/${roomId}/participants/${userId}/role`, { role });
    },

    leaveChatRoom: async (roomId: string, userId: number): Promise<void> => {
         await client.delete(`/chat-rooms/${roomId}/leave`);
    },
};
