import React from "react";
import { Avatar } from "../atoms/Avatar";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isMe: boolean;
  senderName?: string;
  avatarUrl?: string;
}

export const ChatBubble = ({
  message,
  timestamp,
  isMe,
  senderName,
  avatarUrl,
}: ChatBubbleProps) => {
  return (
    <div
      className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {!isMe && (
        <div className="mr-2 mt-1 shrink-0">
          {" "}
          {/* shrink-0: 아바타 찌그러짐 방지 */}
          <Avatar src={avatarUrl} name={senderName} size="sm" />
        </div>
      )}

      <div
        className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}
      >
        {!isMe && senderName && (
          <span className="text-xs text-gray-500 mb-1 ml-1">{senderName}</span>
        )}

        <div
          className={`flex items-end gap-1.5 ${isMe ? "flex-row" : "flex-row-reverse"}`}
        >
          <span className="text-[10px] text-gray-400 min-w-fit mb-1">
            {timestamp}
          </span>

          <div
            className={`
              px-4 py-2 text-sm break-words shadow-sm
              ${
                isMe
                  ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg rounded-br-none" // 오타 수정 & 모양 다듬기
                  : "bg-white text-gray-900 border border-gray-200 rounded-r-lg rounded-tl-lg rounded-bl-none"
              }
            `}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
