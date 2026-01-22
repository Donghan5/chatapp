import { useState, useRef } from "react";
import { User } from "@chatapp/common-types";
import { ChatRoom } from "../../features/chat/types";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ProfileModal } from "../organisms/ProfileModal";

interface SideBarProps {
  user: User;
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onLogout?: () => void;
  onSelectRoom: (roomId: string) => void;
  onCreateRoom?: () => void;
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setIsMenuOpen(false));

  return (
    <aside className="w-[30%] min-w-[320px] max-w-[420px] h-full flex flex-col border-r border-gray-200 bg-white z-20">
      <header className="h-16 bg-gray-100 flex items-center justify-between px-4 border-b border-gray-200 bg-white z-20 relative">
        {/* Profile Dropdown Area */}
        <div className="relative" ref={menuRef}>
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title="My Profile"
          >
            <Avatar
              src={user.avatarUrl || null}
              name={user.name || "?"}
              size="md"
            />
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-xl w-64 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left">
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
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout && onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 text-gray-500 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreateRoom}
            title="New Chat"
            className="text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-2 border-b border-gray-100 flex-shrink-0">
        <Input
          variant="filled"
          placeholder="Search or start new chat"
          className="text-sm"
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              activeRoomId === room.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex-shrink-0">
              <Avatar src={room.avatarUrl} name={room.name} size="md" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-gray-900 font-medium truncate">
                  {room.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {room.updatedAt
                    ? new Date(room.updatedAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">
                  {room.lastMessage || "No messages yet."}
                </p>
                {room.unreadCount > 0 && (
                  <span className="bg-whatsapp-green text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {rooms.length === 0 && !loading && (
          <div className="p-10 text-center text-gray-400 text-sm">
            No active conversations.
          </div>
        )}
      </div>

      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={(name) => {
          console.log("Update name to:", name);
          setIsProfileOpen(false);
        }}
      />
    </aside>
  );
};
