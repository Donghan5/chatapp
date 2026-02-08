import { User } from "@chatapp/common-types";
import { client } from "../../../lib/axios";
import type { ChatRoom, Message, SendMessageRequest } from "../types";

export const chatApi = {
    getRooms: async (): Promise<ChatRoom[]> => {
        const response = await client.get<ChatRoom[]>("/chat-rooms/my");
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

    searchMessages: async (query: string, roomId?: string): Promise<Message[]> => {
        const params = new URLSearchParams({ q: query });
        if (roomId) {
            params.append('roomId', roomId);
        }

        const response = await client.get<Message[]>(`/messages/search?${params}`);
        return response.data;
    },

    editMessage: async (messageId: string, content: string): Promise<Message> => {
        const response = await client.patch<Message>(`/messages/${messageId}`, { content });
        return response.data;
    },

    deleteMessage: async (messageId: string): Promise<void> => {
        await client.delete(`/messages/${messageId}`);
    },

    searchUsers: async (username: string): Promise<User[]> => {
        const response = await client.get<User[]>(`/users/search?username=${username}`);
        return response.data;
    },

    inviteUser: async (roomId: string, userId: number): Promise<void> => {
        await client.post(`/chat-rooms/${roomId}/invite`, { targetUserId: userId });
    },

    uploadFile: async (roomId: string, file: File): Promise<Message> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', roomId);
        const response = await client.post<Message>('/messages/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    addReaction: async (messageId: string, emoji: string): Promise<void> => {
        await client.post(`/messages/${messageId}/reactions`, { emoji });
    },

    getMessages: async (roomId: string, cursor?: number): Promise<{ data: Message[]; nextCursor: number | null }> => {
        const url = cursor
            ? `/messages?roomId=${roomId}&cursor=${cursor}&limit=20`
            : `/messages?roomId=${roomId}&limit=20`;

        const response = await client.get<{ data: Message[]; nextCursor: number | null }>(url);
        return response.data;
    }
};
