import React from "react";
import { ChatRoom } from "../../features/chat/types";
import { Button } from "../atoms/Button";
import { Avatar } from "../atoms/Avatar";

interface HeaderProps {
  room: ChatRoom;
}

export const Header = ({ room }: HeaderProps) => {
  return (
    <header className="h-16 bg-gray-100 flex items-center px-4 border-b border-gray-200 z-10 w-full flex-shrink-0 justify-between">
      <div className="flex items-center flex-1 min-w-0">
        <div className="mr-4 cursor-pointer flex-shrink-0">
          <Avatar
            src={room.avatarUrl || undefined}
            name={room.name}
            size="md"
          />
        </div>
        <div className="flex-1 min-w-0 cursor-pointer">
          <h2 className="font-medium text-gray-900 truncate">{room.name}</h2>
          <p className="text-xs text-gray-500 truncate">online</p>
        </div>
      </div>

      <div className="flex gap-1 text-gray-500 flex-shrink-0">
        <Button variant="ghost" size="icon" title="Search">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-current"
          >
            <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
          </svg>
        </Button>

        <Button variant="ghost" size="icon" title="Menv">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-current"
          >
            <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </Button>
      </div>
    </header>
  );
};
