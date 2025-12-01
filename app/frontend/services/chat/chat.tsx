import React, { FormEvent } from 'react';
import useChat from './useChat';
import { User } from '../../../../packages/common-types/src/user';

export default function ChatLayout({ user }: { user: User }) {
  const {
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage
  } = useChat(user, 'general');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    handleSendMessage(inputMessage);
    setInputMessage('');
  }

  return (
    <div className="flex flex-row w-full h-screen text-gray-800 antialiased overflow-hidden">

      {/* Sidebar - WhatsApp style */}
      <aside className="flex flex-col w-80 h-full border-r border-gray-200 bg-white z-10">
        <header className="p-4 bg-gray-100 flex justify-between items-center border-b border-gray-200 h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {/* User Avatar Placeholder */}
              <svg className="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700">{user.name}</span>
          </div>
        </header>

        <div className="p-3 bg-white border-b border-gray-100">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-gray-100 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-whatsapp-green"
          />
        </div>

        <nav className="flex-1 overflow-y-auto">
          {/* Mock Active Chat Item */}
          <div className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 bg-gray-50">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
              G
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900 truncate">General Chat</h3>
                <span className="text-xs text-gray-400">12:30 PM</span>
              </div>
              <p className="text-sm text-gray-500 truncate">Welcome to the chat!</p>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-whatsapp-chat-bg relative">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
        </div>

        <header className="p-4 bg-gray-100 border-b border-gray-200 h-16 flex items-center gap-4 z-10">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
            G
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">General Chat</h2>
            <p className="text-xs text-gray-500">online</p>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 z-10">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600">
                No messages yet. Say hello! 👋
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === Number(user.id);

              return (
                <div
                  key={index}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-sm text-sm relative ${isMe
                        ? 'bg-whatsapp-light-green text-gray-800 rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none'
                      }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-[10px] text-gray-500 block text-right mt-1 opacity-70">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Bubble Tail SVG */}
                    {isMe ? (
                      <svg className="absolute -right-2 top-0 w-2 h-3 text-whatsapp-light-green fill-current" viewBox="0 0 8 13"><path d="M-2.288 0h10.288v13z" /></svg>
                    ) : (
                      <svg className="absolute -left-2 top-0 w-2 h-3 text-white fill-current transform scale-x-[-1]" viewBox="0 0 8 13"><path d="M-2.288 0h10.288v13z" /></svg>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        <footer className="p-3 bg-gray-100 z-10">
          <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
            <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-whatsapp-green focus:border-transparent"
              placeholder="Type a message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 text-whatsapp-dark-green hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </footer>
      </main>

    </div>
  );
}