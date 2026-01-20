import React, { useState, FormEvent } from 'react';
import { User } from '@chatapp/common-types';
import { useChat } from '../features/chat/hooks/useChat';
import { ChatRoom } from '../features/chat/types';

interface DashboardProps {
  user: User;
  onLogout?: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { 
    rooms, 
    messages, 
    activeRoomId, 
    selectRoom, 
    sendMessage, 
    isLoading 
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');

  const selectedRoom = rooms.find(room => room.id === activeRoomId) || null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    sendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[30%] min-w-[320px] max-w-[420px] h-full flex flex-col border-r border-gray-200 bg-white z-20">
        {/* Header */}
        <header className="h-16 bg-gray-100 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer" title="My Profile">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium text-lg bg-gray-200">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
            )}
          </div>
          <div className="flex gap-4 text-gray-500">
            <span className="self-center font-semibold text-gray-700">{user.name}</span>
            <button onClick={onLogout} title="Logout" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="p-2 border-b border-gray-100 flex-shrink-0">
          <div className="bg-gray-100 flex items-center rounded-lg px-2 py-1">
            <svg className="w-5 h-5 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search or start new chat" className="w-full bg-transparent p-2 focus:outline-none text-sm placeholder-gray-500 text-gray-700" />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {rooms.map(room => (
            <div
              key={room.id}
              onClick={() => selectRoom(room.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeRoomId === room.id ? 'bg-gray-100' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-lg overflow-hidden">
                 {room.avatarUrl ? <img src={room.avatarUrl} alt={room.name} className="w-full h-full object-cover"/> : room.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-gray-900 font-medium truncate">{room.name}</h3>
                  <span className="text-xs text-gray-500">
                    {room.updatedAt ? new Date(room.updatedAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">{room.lastMessage || "No messages yet"}</p>
                  {room.unreadCount > 0 ? (
                    <span className="bg-whatsapp-green text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">{room.unreadCount}</span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {rooms.length === 0 && (
            <div className="p-10 text-center text-gray-400 text-sm">
              No active conversations.
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-whatsapp-chat-bg">
        {selectedRoom ? (
          <>
            {/* Header */}
            <header className="h-16 bg-gray-100 flex items-center px-4 border-b border-gray-200 z-10 w-full flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600 font-bold mr-4 overflow-hidden">
                {selectedRoom.avatarUrl ? <img src={selectedRoom.avatarUrl} alt={selectedRoom.name} className="w-full h-full object-cover"/> : selectedRoom.name[0]}
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-gray-900">{selectedRoom.name}</h2>
                <p className="text-xs text-gray-500">online</p>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-[#e4dcdc]"
              style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'overlay' }}
            >
              {isLoading ? (
                  <div className="flex justify-center mt-10">
                      <span className="text-gray-500 text-sm">Loading messages...</span>
                  </div>
              ) : (
                messages.map((msg, idx) => {
                    const isMe = String(msg.senderId) === String(user.id);
                    return (
                    <div key={idx} className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative px-2 py-1 shadow-sm rounded-lg max-w-[85%] sm:max-w-[65%] text-sm ${isMe ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'}`}>
                        <p className="px-1 text-gray-800 pb-2">{msg.content}</p>
                        <span className="text-[10px] text-gray-500 absolute bottom-1 right-2">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>

                        {/* Tail */}
                        {isMe ? (
                            <svg className="absolute -right-2 top-0 w-2 h-3 text-[#d9fdd3] fill-current" viewBox="0 0 8 13"><path d="M-2.288 0h10.288v13z" /></svg>
                        ) : (
                            <svg className="absolute -left-2 top-0 w-2 h-3 text-white fill-current transform scale-x-[-1]" viewBox="0 0 8 13"><path d="M-2.288 0h10.288v13z" /></svg>
                        )}
                        </div>
                    </div>
                    );
                })
              )}
              
              {!isLoading && messages.length === 0 && (
                <div className="flex justify-center mt-10">
                  <span className="bg-[#fff5c4] text-gray-800 text-xs px-3 py-1 rounded shadow-sm">
                    🔒 Messages are end-to-end encrypted. No one outside of this chat, not even ChatApp, can read or listen to them.
                  </span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <footer className="bg-gray-100 p-3 z-10 flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                  <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current text-gray-500"><path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.066-.346-3.232-.246-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
                </button>
                <input
                  type="text"
                  className="flex-1 py-2 px-4 rounded-lg border border-white bg-white focus:outline-none focus:ring-1 focus:ring-white"
                  placeholder="Type a message"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                />
                <button type="submit" className="p-2 text-gray-500 hover:text-gray-700">
                  <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current text-gray-500"><path transform="rotate(-45 12 12)" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] text-center border-l border-gray-200">
            <div className="max-w-md space-y-6 flex flex-col items-center">
              {/* Placeholder Image */}
              <div className="w-[300px] h-[200px] mb-8 relative">
                <div className="absolute inset-0 bg-[url('https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669ae.svg')] bg-no-repeat bg-center opacity-60 bg-contain"></div>
              </div>
              <h2 className="text-3xl font-light text-gray-600">ChatApp Web</h2>
              <p className="text-sm text-gray-500">Send and receive messages without keeping your phone online.<br />Use ChatApp on up to 4 linked devices and 1 phone.</p>

              <div className="mt-8">
                <p className="text-xs text-gray-400 mt-8 flex items-center justify-center gap-1">
                  <svg viewBox="0 0 24 24" width="12" height="12" className="fill-current"><path d="M18.5 2h-12C4.015 2 2 4.015 2 6.5v12C2 20.985 4.015 23 6.5 23h12c2.485 0 4.5-2.015 4.5-4.5v-12c0-2.485-2.015-4.5-4.5-4.5zm-6 15c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zM12.5 8v3.5l2.475 2.475-.707.707-2.828-2.828.06-4.243h1z"></path></svg>
                  End-to-end encrypted
                </p>
              </div>
            </div>
            <div className="fixed bottom-0 w-full bg-[#25D366] h-1.5 top-0 left-0 hidden"></div>
          </div>
        )}
      </main>
    </div>
  );
}