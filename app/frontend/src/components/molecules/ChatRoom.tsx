import React from "react";

interface ChatRoomProps {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  unreadCount?: number;
  isActive?: boolean;
  onClick: (id: string) => void;
}

export const ChatRoom = ({
  id,
  name,
  avatarUrl,
  lastMessage,
  unreadCount = 0,
  isActive = false,
  onClick,
}: ChatRoomProps) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={`
        flex items-center justify-between p-4 cursor-pointer border-b border-gray-200
        ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}
        `}
    >
      <div className="flex items-center gap-3 overflow-hidden mr-3">
        <Avatar src={avatarUrl} name={name} size="md" className="shrink-0" />
        <div className="flex flex-col gap-1 overflow-hidden mr-3">
          <span className="font-bold text-gray-900 truncate">{name}</span>
          <p className="text-sm text-gray-500 truncate">
            {lastMessage || "No messages yet."}
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-2 bg-red-500 text-white text-xs font-semibold rounded-full">
            <span className="text-xs font-bold text-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
