import { useState, useEffect, useCallback } from 'react';
import { socket } from '../../../lib/socket'; // 👈 방금 만든 소켓 가져오기
import { chatApi } from '../api/chatApi';
import type { ChatRoom, Message } from '../types';

export const useChat = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('🟢 소켓 연결 성공:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔴 소켓 연결 끊김');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.roomId === activeRoomId) {
        setMessages((prev) => [...prev, newMessage]);
      }
      
      setRooms((prevRooms) => 
        prevRooms.map(room => 
          room.id === newMessage.roomId 
            ? { ...room, lastMessage: newMessage.content, unreadCount: room.id === activeRoomId ? 0 : room.unreadCount + 1 }
            : room
        )
      );
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [activeRoomId]);

  const loadRooms = useCallback(async () => {
    try {
      const data = await chatApi.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('채팅방 로드 실패', error);
    }
  }, []);

  const selectRoom = async (roomId: string) => {
    setActiveRoomId(roomId);
    setIsLoading(true);
    
    socket.emit('join_room', roomId); 

    try {
      const msgs = await chatApi.getMessages(roomId);
      setMessages(msgs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!activeRoomId) return;

    socket.emit('send_message', {
      roomId: activeRoomId,
      content: text,
    });

  };

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return { rooms, messages, activeRoomId, selectRoom, sendMessage, isLoading };
};