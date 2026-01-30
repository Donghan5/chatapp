import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useChat } from "../features/chat/hooks/useChat";
import { SideBar } from "../components/organisms/SideBar";
import { Header } from "../components/organisms/Header";
import { ChatBubble } from "../components/molecules/ChatBubble";
import { MessageInput } from "../components/molecules/MessageInput";
import { useNotifications } from "../features/chat/hooks/useNotifications";

const DashboardPage = () => {
    const navigate = useNavigate();

    const { user, logout, isLoading: isAuthLoading } = useAuth();

    const {
        rooms,
        messages,
        activeRoomId,
        selectRoom,
        sendMessage,
        createRoom,
        isLoading: isChatLoading,
        sendTyping,
        typingUsers,
    } = useChat();

    useNotifications(activeRoomId);

    // If not logged in, force redirect to login page
    useEffect(() => {
        if (!isAuthLoading && !user) {
            navigate("/login");
        }
    }, [user, isAuthLoading, navigate]);

    if (isAuthLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    const selectedRoom = rooms.find((room) => room.id === activeRoomId) || null;

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <SideBar
                user={user}
                rooms={rooms}
                activeRoomId={activeRoomId}
                onSelectRoom={selectRoom}
                onLogout={logout}
                onCreateRoom={createRoom}
                loading={isChatLoading}
            />

            <main className="flex-1 flex flex-col relative bg-whatsapp-chat-bg">
                {selectedRoom ? (
                    <>
                        <Header room={selectedRoom} />

                        <div
                            className="flex-1 overflow-y-auto p-4 sm:p-10 bg-[#e4dcdc]"
                            style={{
                                backgroundImage:
                                    'url("https://user-images.githubusercontent.com/11719160/194953107-1e3f6e66-3f5d-4f5d-9552-1e3b4f1a5f65.png")',
                                backgroundBlendMode: "overlay",
                            }}
                        >
                            {isChatLoading && messages.length === 0 ? (
                                <div className="flex justify-center mt-10">
                                    <span className="text-gray-500 text-sm">
                                        Loading messages...
                                    </span>
                                </div>
                            ) : (
                                Array.isArray(messages) && messages.map((msg) => {
                                    const isMe = String(msg.senderId) === String(user.id);
                                    return (
                                        <ChatBubble
                                            key={msg.id || msg.createdAt}
                                            message={msg.content}
                                            timestamp={
                                                msg.createdAt
                                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : ""
                                            }
                                            isMe={isMe}
                                            senderName={!isMe ? selectedRoom.name : undefined}
                                            avatarUrl={!isMe ? selectedRoom.avatarUrl : undefined}
                                            status={isMe ? msg.status : undefined}
                                        />
                                    );
                                })
                            )}

                            {!isChatLoading && messages.length === 0 && (
                                <div className="flex justify-center mt-10">
                                    <span className="bg-[#fff5c4] text-gray-800 text-xs px-3 py-1 rounded shadow-sm">
                                        Messages are end-to-end encrypted.
                                    </span>
                                </div>
                            )}
                        </div>
                        {typingUsers.size > 0 && (
                        <div className="px-4 py-2 flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                            <span className="text-gray-500 text-sm">
                                {Array.from(typingUsers.values()).join(", ")} typing...
                            </span>
                        </div>
                        )}
                        <MessageInput
                            onSendMessage={sendMessage}
                            onTyping={sendTyping}
                            placeholder="Type a message"
                        />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] text-center border-l border-gray-200">
                        <div className="max-w-md space-y-6 flex flex-col items-center">
                            <div className="w-[300px] h-[200px] mb-8 relative">
                                <div className="absolute inset-0 bg-[url('https://statis.whatsapp.net/5.2201.6/whatsapp/web/assets/1d7fcb7fb4d8bb6f5d28b2e5d6f2f2a3.png')] bg-contain bg-center bg-no-repeat opacity-40"></div>
                            </div>
                            <h2 className="text-3xl font-light text-gray-600">ChatApp Web</h2>
                            <p className="text-sm text-gray-500">
                                Send and receive messages without keeping your phone online.
                            </p>
                        </div>
                        <div className="fixed bottom-0 w-full bg-[#25D366] h-1.5 top-0 left-0 hidden"></div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;

