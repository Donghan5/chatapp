import { useState, useEffect } from 'react';
import { User } from '../../../../packages/common-types/src/user'; // 경로 확인 필요

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
        // [API Calling]
        // const res = await fetch('/api/chat/rooms');
        // if (!res.ok) throw new Error('Failed to fetch rooms');
        // const data = await res.json();
        // setRooms(data);

        // [Test]
        await new Promise(resolve => setTimeout(resolve, 500));
        setRooms([
            { id: 101, name: "Dev Team", lastMessage: "Deploy is ready", updatedAt: "10:30 AM", unreadCount: 2 },
            { id: 102, name: "Marketing", lastMessage: "New campaign assets", updatedAt: "09:15 AM", unreadCount: 0 },
            { id: 103, name: "Project X", lastMessage: "Meeting at 3 PM", updatedAt: "Yesterday", unreadCount: 5 },
        ]);

      } catch (err) {
        setError('Failed to load chats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  return { rooms, loading, error };
}