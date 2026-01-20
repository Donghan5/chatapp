export interface ChatRoom {
	id: string;
	name: string;
	avatarUrl?: string;
	lastMessage?: string;
	unreadCount: number;
	updatedAt: string;
}

export interface Message {
	id: string;
	senderId: string;
	content: string;
	createdAt: string;
	roomId: string;
}

export interface SendMessageRequest {
	roomId: string;
	content: string;
}