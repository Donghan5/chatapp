import React, { FormEvent } from "react";
import { useChat } from "../features/chat/hooks/useChat";
import { useAuth } from "../features/auth/hooks/useAuth"; // Import useAuth
import { User } from "../../../../packages/common-types/src/user";
import { SideBar } from "../components/organisms/SideBar"; // Import reusable Sidebar

export default function ChatPage({ user }: { user: User }) {
  const { rooms, messages, activeRoomId, selectRoom, sendMessage, isLoading } =
    useChat();

  const { logout } = useAuth(); // Get logout function

  const [inputMessage, setInputMessage] = React.useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage); // Use sendMessage from useChat
    setInputMessage("");
  };

  const handleCreateRoom = () => {
    // TODO: Implement "Select User" modal here
    const email = window.prompt("Enter email of user to chat with:");
    if (email) {
      alert(
        "Feature in progress: Need to implement user search/selection API first.",
      );
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
            </header>

            <section className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 z-10">
              {messages.map((msg, index) => {
                const isMe = Number(msg.senderId) === Number(user.id);
                return (
                  <div
                    key={index}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-sm text-sm relative ${
                        isMe
                          ? "bg-[#d9fdd3] text-gray-800 rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-[10px] text-gray-500 block text-right mt-1 opacity-70">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
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
      </main>
    </div>
  );
}

