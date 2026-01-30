import { useEffect, useState } from "react"
import { socket } from "../../../lib/socket"

export const usePresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!socket) return;

    const  handleUserStatus = ({ userId, status }: { userId: number; status: 'online' | 'offline'; }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (status === 'online') {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    };

    const handleInitialOnlineUsers = (users: number[]) => {
      setOnlineUsers(new Set(users));
    };

    socket.on('userStatus', handleUserStatus);

    socket.on('connect', () => {
      socket.emit('getOnlineUsers', null, handleInitialOnlineUsers);
    });

    if (socket.connected) {
      socket.emit('getOnlineUsers', null, handleInitialOnlineUsers);
    }

    return () => {
      socket.off('userStatus', handleUserStatus);
      socket.off('connect');
      socket.off('getOnlineUsers');
    };
  }, []);

  const isUserOnline = (userId: number) => onlineUsers.has(userId);
  return { onlineUsers, isUserOnline };
};