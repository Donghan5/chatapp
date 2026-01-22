import { useState, useRef } from "react";
import { User } from "@chatapp/common-types";
import { ChatRoom } from "../../features/chat/types";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { useOutsideClick } from "../../hooks/useOutsideClick";

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
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setIsMenuOpen(false));

  return (
    <aside className="w-[30%] min-w-[320px] max-w-[420px] h-full flex flex-col border-r border-gray-200 bg-white z-20">
      <header className="h-16 bg-gray-100 flex items-center justify-between px-4 border-b border-grat-200 bg-white z-20">
        <div className="cursor-pointer" title="My Profile">
          <Avatar
            src={user.avatarUrl || undefined}
            alt={user.name || "User Avatar"}
            size="md"
          />
        </div>

        <div className="flex gap-4 text-gray-500 items-center">
          <span className="font-semibold text-gray-700 text-sm hidden sm:block">
            {user.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreateRoom}
            title="New Chat"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </Button>
        </div>
      </header>

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
    </aside>
  );
};
