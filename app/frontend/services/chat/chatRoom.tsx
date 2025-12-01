import { useState, useEffect } from 'react';
import { User } from '../../../../packages/common-types/src/user';

export interface ChatRoom {
  id: number;
  name: string;
  lastMessage?: string;
  updatedAt: string;
  unreadCount?: number;
}

export function useChatRooms(user: User | null) {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
        setLoading(true);
        setError(null);
        try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('No auth token found');
        }

        const res = await fetch('/api/chat/rooms', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error('Failed to fetch rooms');
        
        const data = await res.json();
        
        const formattedRooms = data.map((room: any) => ({
            ...room,
            updatedAt: new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        setRooms(formattedRooms);

        } catch (err: any) {
        setError(err.message || 'Failed to load chats');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchRooms();
    }, [user]);

    return { rooms, loading, error };
}