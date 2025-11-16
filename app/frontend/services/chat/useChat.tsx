import React, { useState, useEffect, useRef, FormEvent } from 'react';
// implement real-time chat features here

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
		const socket = new WebSocket('ws://localhost:3000');
		ws.current = socket;

		socket.onopen = () => {
			console.log('WebSocket connected');

			socket.send(JSON.stringify({
				type: 'joinRoom',
				roomId: roomId
			}));
		};

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);

			if (message.type === 'message') {
				setMessages((prevMessages) => [...prevMessages, message]);
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
			senderId: user.id,
			content: content
		};

		ws.current.send(JSON.stringify(messagePayload));
	}

	return {
		messages,
		inputMessage,
		setInputMessage,
		handleSendMessage
	};
}