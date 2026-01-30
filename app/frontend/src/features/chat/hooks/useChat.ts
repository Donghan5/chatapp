import { useState, useEffect, useCallback } from "react";
import { socket } from "../../../lib/socket";
import { chatApi } from "../api/chatApi";
import type { ChatRoom, Message, MessageStatus } from "../types";

export const useChat = () => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Map<number, string>>(new Map());

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

    const loadMessages = async (roomId: string) => {
        try {
            const data = await chatApi.getMessages(roomId);
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load messages", error);
            setMessages([]);
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

    const sendTyping = (isTyping: boolean) => {
        if (!activeRoomId) return;

        socket.emit('typing', { roomId: activeRoomId, isTyping });
    };

    useEffect(() => {
        loadRooms();

        const handleUserTyping = ({ userId, userName, roomId, isTyping }: {
            userId: number;
            userName: string;
            roomId: number;
            isTyping: boolean;
        }) => {
            setTypingUsers((prev) => {
                const newMap = new Map(prev);
                if (isTyping) {
                    newMap.set(userId, userName);
                } else {
                    newMap.delete(userId);
                }
                return newMap;
            })
        }

        const handleMessagesDelivered = ({ roomId, deliveredTo }: { roomId: string; deliveredTo: number }) => {
            if (String(roomId) === String(activeRoomId)) {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.status === 'sent' ? { ...msg, status: 'delivered' as MessageStatus } : msg
                    )
                );
            }
        };


        const handleMessagesRead = ({ roomId, messageIds }: { roomId: string; messageIds: number[] }) => {
            if (String(roomId) === String(activeRoomId)) {
                setMessages(prev =>
                    prev.map(msg =>
                        messageIds.includes(Number(msg.id)) ? { ...msg, status: 'read' as MessageStatus } : msg
                    )
                );
            }
        };

        // I will check this logic
        const handleMessagesDeleted = ({ roomId, messageIds }: { roomId: string; messageIds: number[] }) => {
            if (String(roomId) === String(activeRoomId)) {
                setMessages(prev =>
                    prev.map(msg =>
                        messageIds.includes(Number(msg.id)) ? { ...msg, status: 'deleted' as MessageStatus } : msg
                    )
                );
            }
        };

        socket.on('userTyping', handleUserTyping);
        socket.on('messagesDelivered', handleMessagesDelivered);
        socket.on('messagesRead', handleMessagesRead);
        socket.on('messagesDeleted', handleMessagesDeleted);

        return () => {
            socket.off('userTyping', handleUserTyping);
            socket.off('messagesDelivered', handleMessagesDelivered);
            socket.off('messagesRead', handleMessagesRead);
            socket.off('messagesDeleted', handleMessagesDeleted);
        }
    }, [activeRoomId]);

    const markMessageAsRead = (messageIds: string[]) => {
        if (!activeRoomId || messageIds.length === 0) return;

        socket.emit('markAsRead', { roomId: activeRoomId, messageIds });
    };

    return { 
        rooms, 
        messages, 
        activeRoomId, 
        selectRoom, 
        sendMessage, 
        isLoading, 
        createRoom, 
        loadMessages, 
        sendTyping, 
        typingUsers,
        markMessageAsRead 
    };
};
