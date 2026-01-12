import React, { useState } from 'react';
import { User } from '../../../../packages/common-types/src/user'; 
import { useChatRooms, ChatRoom } from '../chat/chatRoom'; // 위에서 만든 Hook import

interface DashboardProps {
  user: User;
  onLogout?: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'settings'>('chats');
  
  const { rooms, loading, error } = useChatRooms(user);
  
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  return (
    <div className="flex h-screen bg-whatsapp-bg overflow-hidden">
      
      <aside className="w-16 bg-whatsapp-dark-green flex flex-col items-center py-4 space-y-4 text-white">
        <div className="mb-4 p-2 bg-white/10 rounded-full cursor-pointer" title="Profile">
           <span className="font-bold">{user?.name ? user.name.substring(0, 1).toUpperCase() : 'U'}</span>
        </div>
        <nav className="flex-1 flex flex-col space-y-2 w-full">
          <NavIcon label="Chats" active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
          <NavIcon label="Friends" active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} />
          <NavIcon label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
        <button onClick={onLogout} className="mt-auto p-2 hover:bg-white/10 rounded-lg transition-colors text-xs" title="Logout">
          Logout
        </button>
      </aside>

      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <header className="h-16 bg-gray-100 flex items-center px-4 border-b border-gray-200 justify-between">
          <h2 className="text-xl font-bold text-gray-700 capitalize">{activeTab}</h2>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' && (
            <>
              {loading && <div className="p-4 text-center text-gray-500">Loading chats...</div>}
              {error && <div className="p-4 text-center text-crimson">{error}</div>}
              
              {!loading && !error && (
                <ul>
                  {rooms.map((room) => (
                    <li 
                      key={room.id} 
                      onClick={() => setSelectedRoom(room)}
                      className={`p-4 cursor-pointer border-b border-gray-100 flex gap-3 transition-colors ${
                        selectedRoom?.id === room.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                        {room.name[0]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{room.name}</h3>
                          <span className="text-xs text-gray-500">{room.updatedAt}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500 truncate max-w-[80%]">
                                {room.lastMessage || "No messages yet"}
                            </p>
                            {room.unreadCount ? (
                                <span className="bg-whatsapp-green text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                    {room.unreadCount}
                                </span>
                            ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!loading && !error && rooms.length === 0 && (
                 <div className="p-8 text-center text-gray-400">No active chats found.</div>
              )}
            </>
          )}
          
          {activeTab === 'contacts' && <div className="p-4 text-gray-500 text-center">Contacts list here</div>}
          {activeTab === 'settings' && <div className="p-4 text-gray-500 text-center">Settings here</div>}
        </div>
      </div>

      <main className="flex-1 flex flex-col bg-whatsapp-chat-bg relative">
        {selectedRoom ? (
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-gray-100 flex items-center px-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                        {selectedRoom.name[0]}
                    </div>
                    <h3 className="font-bold text-gray-800">{selectedRoom.name}</h3>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    <p className="text-center text-gray-400 my-4">Start of conversation in {selectedRoom.name}</p>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <h3 className="text-2xl font-light mb-2">Welcome to ChatApp</h3>
                <p>Select a chat to start a conversation</p>
            </div>
        )}
      </main>
    </div>
  );
}

function NavIcon({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 flex justify-center transition-colors ${
        active ? 'bg-white/20 border-l-4 border-white' : 'hover:bg-white/10 border-l-4 border-transparent'
      }`}
      title={label}
    >
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}