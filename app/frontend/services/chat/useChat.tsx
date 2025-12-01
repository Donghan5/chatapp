import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../../../packages/common-types/src/user';

interface ChatMessage {
	type: 'message';
	roomId: string;
	senderId: number;
	content: string;
}

export default function useChat(user: User, roomId: string) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputMessage, setInputMessage] = useState('');

	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		// Connect to the new WebSocket route
		const socket = new WebSocket('ws://localhost:3000/ws/chat');
		ws.current = socket;

		socket.onopen = () => {
			console.log('WebSocket connected');

			socket.send(JSON.stringify({
				type: 'joinRoom',
				roomId: roomId
			}));
		};

		socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);

				if (message.type === 'message') {
					setMessages((prevMessages) => [...prevMessages, message]);
				}
			} catch (e) {
				console.error('Failed to parse message', e);
			}
		};

		socket.onclose = () => {
			console.log('WebSocket disconnected');
		}

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		}

		return () => {
			socket.close();
		};
	}, [roomId]);

	const handleSendMessage = (content: string) => {
		if (!content.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
			return;
		}

		const messagePayload: ChatMessage = {
			type: 'message',
			roomId: roomId,
			senderId: Number(user.id), // Ensure ID is number if backend expects it, or string if consistent
			content: content
		};

		// Optimistic update
		// setMessages((prev) => [...prev, messagePayload]);

		ws.current.send(JSON.stringify(messagePayload));
	}

	return {
		messages,
		inputMessage,
		setInputMessage,
		handleSendMessage
	};
}