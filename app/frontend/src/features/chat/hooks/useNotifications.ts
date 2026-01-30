import { useEffect, useCallback } from "react";
import { socket } from '../../../lib/socket';
import { Message } from '../types';

export const useNotifications = (activeRoomId: string | null) => {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((message: Message) => {
    const isRoomActive = String(message.roomId) === String(activeRoomId);
    const isTabFocused = document.visibilityState === 'visible';

    if (isRoomActive && isTabFocused) return;

    if (Notification.permission === 'granted') {
      const notification = new Notification('New Message', {
        body: message.content,
        icon: '/vite.svg',
        tag: `room-${message.roomId}`,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      }
    }
  }, [activeRoomId]);

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      showNotification(message);
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    }
  }, [showNotification]);
}