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

    addParticipant: async (roomId: string, userId: number): Promise<void> => {
        await client.post(`/chat-rooms/${roomId}/participants`, { userId });
    },

    removeParticipant: async (roomId: string, userId: number): Promise<void> => {
        await client.delete(`/chat-rooms/${roomId}/participants`, { data: { userId } });
    },

    updateRoomName: async (roomId: string, name: string): Promise<void> => {
        await client.put(`/chat-rooms/${roomId}`, { name });
    },
};
