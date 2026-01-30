import { User } from "@chatapp/common-types";

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'deleted';

export interface ChatRoom {
	id: string;
	name: string;
	avatarUrl?: string;
	lastMessage?: string;
	unreadCount: number;
	updatedAt: string;
	isGroup: boolean;
	participants?: User[];
	createdBy?: User;
}

export interface Message {
	id: string;
	senderId: string;
	content: string;
	createdAt: string;
	roomId: string;
	status?: MessageStatus;
}

export interface SendMessageRequest {
	roomId: string;
	content: string;
}