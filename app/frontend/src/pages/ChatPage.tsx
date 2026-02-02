import{ useState, FormEvent, useRef } from "react";
import { useChat } from "../features/chat/hooks/useChat";
import { useAuth } from "../features/auth/hooks/useAuth";
import { User } from "../../../../packages/common-types/src/user";
import { SideBar } from "../components/organisms/SideBar";
import { GroupSettingsModal } from "../components/organisms/GroupSettingsModal";
import { Message } from '../features/chat/types';
import { chatApi } from '../features/chat/api/chatApi';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

export default function ChatPage({ user }: { user: User }) {
    const { 
        rooms, 
        messages, 
        activeRoomId, 
        selectRoom, 
        sendMessage, 
        isLoading, 
        createRoom,
        loadMessages
    } =
        useChat();

    const { logout } = useAuth(); // Get logout function

    const [inputMessage, setInputMessage] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Message[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showReactionPicker, setShowReactionPicker] = useState<string|null>(null);

    const handleFileUpload = async() => {
        if (!selectedFile || !activeRoomId) return;
    
        await chatApi.uploadFile(activeRoomId, selectedFile);
        setSelectedFile(null);
        if (activeRoomId) await loadMessages(activeRoomId);
    }

    const handleEditMessages = async (messageId: string) => {
        if (!editContent.trim()) return;
        await chatApi.editMessage(messageId, editContent);
        setEditingMessageId(null);
        setEditContent("");
        if (activeRoomId) await loadMessages(activeRoomId);
    }

    const handleDeleteMessages = async (messageId: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        await chatApi.deleteMessage(messageId);
        if (activeRoomId) await loadMessages(activeRoomId);
    }

    const handleSearch = async () => {
        if (searchQuery.trim().length < 2) return;
        setIsSearching(true);
        try {
            const result = await chatApi.searchMessages(searchQuery, activeRoomId || undefined)
            setSearchResults(result);
        } finally {
            setIsSearching(false);
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        sendMessage(inputMessage); // Use sendMessage from useChat
        setInputMessage("");
    };

    const handleCreateRoom = async () => {
        console.log("handleCreateRoom called");
        const name = window.prompt("Enter name for new chat room:");
        if (!name) return;

        const newRoom = await createRoom(name);
        if (newRoom) {
            selectRoom(newRoom.id.toString());
        }
    };

    return (
        <div className="flex flex-row w-full h-screen text-gray-800 antialiased overflow-hidden">
            {/* Replaced hardcoded Sidebar with Component */}
            <SideBar
                user={user}
                rooms={rooms}
                activeRoomId={activeRoomId}
                onSelectRoom={selectRoom}
                onLogout={logout}
                onCreateRoom={handleCreateRoom}
                loading={isLoading}
            />

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full bg-[#E5DDD5] relative">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                    }}
                ></div>

                {activeRoomId ? (
                    <>
                        <header className="p-4 bg-gray-100 border-b border-gray-200 h-16 flex items-center gap-4 z-10">
                            {(() => {
                                const room = rooms.find((r) => r.id === activeRoomId);
                                return (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold overflow-hidden">
                                            {room?.avatarUrl ? (
                                                <img
                                                    src={room.avatarUrl}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                room?.name?.[0] || "?"
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-gray-800">
                                                {room?.name || "Chat"}
                                            </h2>
                                            <p className="text-xs text-gray-500">online</p>
                                        </div>
                                    </>
                                );
                            })()}
                            <div className="ml-auto">
                                <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-200 rounded-full">
                                    ⚙️
                                </button>
                            </div>
                        </header>

                        <div className="flex gap-2 ml-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search ..."
                                className="px-2 py-1 text-sm border rounded"
                            />
                            <button onClick={handleSearch} className="p-2 hover:bg-gray-200 rounded-full">
                                🔍
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="bg-white border-b p-2 max-h-40 overflow-y-auto z-10">
                                <h4 className="text-xs font-semibold mb-1">Search Results</h4>
                                {searchResults.map((msg) => (
                                    <div key={msg.id} className="p-1 text-sm hover:bg-gray-100 rounded">
                                        {msg.content}
                                    </div>
                                ))}
                                <button onClick={() => setSearchResults([])} className="text-xs text-gray-500">Clear</button>
                            </div>
                        )}

                        <section className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 z-10">
                            {messages.map((msg, index) => {
                                const isMe = Number(msg.senderId) === Number(user.id);
                                return (
                                    <div
                                        key={index}
                                        className={`group flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-sm text-sm relative ${isMe
                                                ? "bg-[#d9fdd3] text-gray-800 rounded-tr-none"
                                                : "bg-white text-gray-800 rounded-tl-none"
                                                }`}
                                        >
                                            {editingMessageId === msg.id ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="flex-1 px-2 py-1 text-sm border rounded"
                                                    />
                                                    <button onClick={() => handleEditMessages(msg.id)} className="text-blue-500 text-xs">Save</button>
                                                    <button onClick={() => setEditingMessageId(null)} className="text-gray-500 text-xs">Cancel</button>
                                                </div>
                                            ) : (
                                                <p>{msg.content}</p>
                                            )}
                                            <span className="text-[10px] text-gray-500 block text-right mt-1 opacity-70">
                                                {msg.createdAt
                                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : ""}
                                            </span>
                                            {isMe && (
                                                <div className="flex gap-1 text-xs opacity-0 group-hover:opacity-100">
                                                    <button onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); }}>Edit</button>
                                                    <button onClick={() => handleDeleteMessages(msg.id)}>Delete</button>
                                                </div>
                                            )}
                                            {msg.fileUrl && (
                                                msg.fileType === 'image' ? (
                                                    <img src={msg.fileUrl} alt="" className="max-w-xs mt-2 rounded" />
                                                ) : (
                                                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Download {msg.fileName}</a>
                                                )
                                            )}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                                                    className="text-xs opacity-0 group-hover:opacity-100"   
                                                >
                                                    😀
                                                </button>
                                                {showReactionPicker === msg.id && (
                                                    <div className="absolute bottom-full left-0 bg-white shadow-lg rounded-lg p-1 flex gap-1">
                                                        {EMOJIS.map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => {chatApi.addReaction(msg.id, emoji); setShowReactionPicker(null); }}
                                                                className="hover:bg-gray-100 p-1 rounded"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {msg.reactions && msg.reactions.length > 0 && (
                                                <div className="flex gap-1 mt-1">
                                                    {Object.entries(
                                                        msg.reactions.reduce((acc, r) => {
                                                            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                                            return acc;
                                                        }, {} as Record<string, number>)
                                                    ).map(([emoji, count]) => (
                                                        <span key={emoji} className="text-xs bg-gray-100 px-1 rounded">{emoji} {count}</span>
                                                    ))}
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>

                        <footer className="p-3 bg-gray-100 z-10">
                            <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Type a message"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="p-2 text-green-600 hover:bg-gray-200 rounded-full"
                                >
                                    <svg
                                        className="w-6 h-6 transform rotate-90"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-200 rounded">
                                    📎
                                </button>
                                {selectedFile && (
                                    <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded">
                                        <span className="text-sm truncate max-w-32">{selectedFile.name}</span>
                                        <button type="button" onClick={handleFileUpload} className="text-blue-500">Send</button>
                                        <button type="button" onClick={() => setSelectedFile(null)} className="text-gray-500">x</button>
                                    </div>
                                )}
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col text-gray-500 z-10">
                        <div className="bg-white/80 p-6 rounded-lg shadow-sm text-center">
                            <h3 className="text-lg font-medium mb-2">
                                Welcome to WhatsApp Clone
                            </h3>
                            <p>Select a chat from the sidebar or start a new conversation.</p>
                        </div>
                    </div>
                )}

                {activeRoomId && rooms.find(r => r.id === activeRoomId) && (
                    <GroupSettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        room={rooms.find(r => r.id === activeRoomId)!}
                        currentUser={user}
                        onUpdateRoom={() => {
                            window.location.reload(); // Simple refresh --> after elaborate refresh method
                        }}
                    />
                )}

                
            </main>
        </div>
    );
}

