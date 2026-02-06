import { useState, useRef } from "react";
import { Avatar } from "../atoms/Avatar";
import { Input } from "../atoms/Input";
import { ProfileModal } from "../organisms/ProfileModal";
import { CreateChatModal } from "../organisms/CreateChatModal";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { FriendList } from "../../features/friends/ui/FriendList";
import { User } from "@chatapp/common-types";
import { ChatRoom } from "../../features/chat/types";
import { chatApi } from "../../features/chat/api/chatApi";
import { usePresence } from "../../features/chat/hooks/usePresence";

interface SideBarProps {
  user: User;
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onLogout?: () => void;
  onSelectRoom: (roomId: string) => void;
  onCreateRoom?: (roomName: string, inviteUserIds: number[]) => void;
  loading?: boolean;
}

export const SideBar = ({
  user,
  rooms,
  activeRoomId,
  onLogout,
  onSelectRoom,
  onCreateRoom,
  loading = false,
}: SideBarProps) => {
  const [viewMode, setViewMode] = useState<"chats" | "friends">("chats");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { isUserOnline } = usePresence();

  const menuRef = useRef<HTMLDivElement>(null);

  const getRoomDisplayName = (room: ChatRoom, currentUserId: number): string => {
    if (room.isGroup) {
      return room.name;
    }
    // For DM chats, show the other participant's name
    const otherParticipant = room.participants?.find(p => Number(p.user.id) !== currentUserId);
    return otherParticipant?.user.username || otherParticipant?.user.email?.split('@')[0] || room.name;
  };

  useOutsideClick(menuRef, () => {
    if (isMenuOpen) setIsMenuOpen(false);
  });

  return (
    <aside className="w-[30%] min-w-[320px] max-w-[420px] h-full flex flex-col border-r border-gray-200 bg-white z-20">
      <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white shrink-0">
        <div className="relative" ref={menuRef}>
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <Avatar
              src={user.avatarUrl || null}
              name={user.name || user.email?.split('@')[0] || "?"}
              size="md"
            />
          </div>

          {isMenuOpen && (
            <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-xl w-64 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900 truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </header>
      
      <div className="flex border-b border-gray-100 bg-white">
        <button
          onClick={() => setViewMode("chats")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${viewMode === "chats" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500 hover:bg-gray-50"}`}
        >
          Chats
        </button>
        <button
          onClick={() => setViewMode("friends")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${viewMode === "friends" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500 hover:bg-gray-50"}`}
        >
          Friends
        </button>
      </div>

      <div className="p-2 border-b border-gray-100 shrink-0">
        <Input
          variant="filled"
          placeholder={viewMode === "chats" ? "Search Chat" : "Search Friend"}
          className="text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {viewMode === "chats" ? (
          rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeRoomId === room.id ? "bg-gray-100" : ""}`}
              >
                <Avatar src={room.avatarUrl} name={room.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-gray-900 font-medium truncate">
                      {getRoomDisplayName(room, Number(user.id))}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {room.updatedAt
                        ? new Date(room.updatedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {room.lastMessage || "No messages."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="p-10 text-center text-gray-400 text-sm">
                No active conversations.
              </div>
            )
          )
        ) : (
          <FriendList
            onStartChat={async (friendId) => {
              try {
                const room = await chatApi.createOrGetDM(friendId);
                setViewMode("chats");
                onSelectRoom(room.id);
              } catch (error) {
                console.error("Failed to create or get DM room:", error);
              }
            }}
            isUserOnline={isUserOnline}
          />
        )}

      </div>

      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={() => setIsProfileOpen(false)}
      />
      <CreateChatModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreateRoom ?? (() => {})}
      />
    </aside>
  );
};
