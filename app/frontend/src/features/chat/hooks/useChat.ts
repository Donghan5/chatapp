import { useState, useEffect, useCallback } from "react";
import { socket } from "../../../lib/socket";
import { chatApi } from "../api/chatApi";
import type { ChatRoom, Message } from "../types";

export const useChat = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("🟢 Connected from socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from socket:", socket.id);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      if (String(newMessage.roomId) === String(activeRoomId)) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === newMessage.roomId
            ? {
                ...room,
                lastMessage: newMessage.content,
                unreadCount:
                  String(room.id) === String(activeRoomId)
                    ? 0
                    : room.unreadCount + 1,
              }
            : room,
        ),
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [activeRoomId]);

  const loadRooms = useCallback(async () => {
    try {
      const data = await chatApi.getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Fail to load chat room", error);
    }
  }, []);

  const selectRoom = async (roomId: string) => {
    setActiveRoomId(roomId);
    setIsLoading(true);

    socket.emit("joinRoom", roomId);

    try {
      const msgs = await chatApi.getMessages(roomId);
      setMessages(msgs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async (name: string, inviteUserIds?: number[]) => {
    try {
      const newRoom = await chatApi.createRoom(name, false, inviteUserIds);
      await loadRooms();
      return newRoom;
    } catch (error) {
      console.error("Fail to create chat room", error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!activeRoomId) return;

    socket.emit("sendMessage", {
      roomId: activeRoomId,
      content: text,
    });
  };

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return { rooms, messages, activeRoomId, selectRoom, sendMessage, isLoading, createRoom };
};
