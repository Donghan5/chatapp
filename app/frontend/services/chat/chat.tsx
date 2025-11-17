import React, { FormEvent } from 'react';
import useChat from './useChat';
import { User } from '@chatapp/common-types'; 

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
    <div className="flex flex-row w-full h-screen text-gray-800 antialiased">
      
      <aside className="flex flex-col w-64 h-full border-r border-gray-300 bg-gray-100">
        <header className="p-4 border-b border-gray-300 bg-white">
          <h1 className="text-lg font-semibold">Chats</h1>
        </header>
        <nav className="flex-1 overflow-y-auto p-4">
           <div className="text-sm text-gray-500 text-center mt-4">
             No active chats
           </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full">
        <header className="p-4 border-b border-gray-300 bg-white">
          <h2 className="text-lg font-semibold">General Chat</h2>
        </header>
        
        <section className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2">
          {messages.length === 0 ? (
             <div className="flex-1 flex items-center justify-center text-gray-400">
                No messages yet. Say hello!
             </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === user.id;
              
              return (
                <div 
                  key={index} 
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm text-sm ${
                      isMe 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <footer className="p-4 border-t border-gray-300 bg-white">
          <form className="flex" onSubmit={handleSubmit}>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </footer>
      </main>
      
    </div>
  );
}