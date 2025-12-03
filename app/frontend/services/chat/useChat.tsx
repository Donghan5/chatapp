import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../../../packages/common-types/src/user';

export interface ChatMessage {
    id?: number;
    type?: 'message';
    roomId: string | number;
    senderId: number;
    content: string;
    createdAt?: string;
}

export default function useChat(user: User, roomId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false); // Track loading state

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!roomId) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (res.ok) {
                    const history = await res.json();
                    setMessages(history); 
                } else {
                    console.error("Failed to load message history");
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [roomId]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000/ws/chat'); // Ensure port/path is correct
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

                if (message.type === 'message' && String(message.roomId) === String(roomId)) {
                    setMessages((prev) => {
                        return [...prev, message];
                    });
                }
            } catch (e) {
                console.error('Failed to parse message', e);
            }
        };

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
            senderId: Number(user.id),
            content: content,
            createdAt: new Date().toISOString() // Optimistic timestamp
        };

        ws.current.send(JSON.stringify(messagePayload));
    }

    return {
        messages,
        inputMessage,
        setInputMessage,
        handleSendMessage,
        loading
    };
}