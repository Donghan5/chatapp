import React from 'react';
import useChat from './useChat';
import { User } from '@chatapp/common-types';

export default function ChatLayout({ user }: { user: User }) {
  const {
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage
  } = useChat(user, 'general'); // For now, we use a fixed room ID ( todo: make it dynamic )
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(e);
    setInputMessage('');
  }

  return (
    <div className="flex flex-row w-full h-screen text-gray-800 antialiased">
      
      <aside className="flex flex-col w-64 h-full border-r border-gray-300 bg-gray-100">
        <header className="p-4 border-b border-gray-300 bg-white">
          <h1 className="text-lg font-semibold">Chats</h1>
        </header>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Chat 1</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Chat 2</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Chat 3</li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full">
        <header className="p-4 border-b border-gray-300 bg-white">
          <h2 className="text-lg font-semibold">Chat Title</h2>
        </header>
        <section className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="mb-4">
            <div className="inline-block bg-white p-2 rounded shadow mb-2">
              <p>Hello! How are you?</p>
            </div>
          </div>
          <div className="mb-4 text-right">
            <div className="inline-block bg-blue-500 text-white p-2 rounded shadow mb-2">
              <p>I'm good, thanks! How about you?</p>
            </div>
          </div>
        </section>
        <footer className="p-4 border-t border-gray-300 bg-white">
          <form className="flex">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </form>
        </footer>
      </main>
      
    </div>
  );
}