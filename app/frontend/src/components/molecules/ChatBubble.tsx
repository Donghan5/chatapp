import React from "react";
import { Avatar } from "../atoms/Avatar";
import { MessageStatusIcon } from "../atoms/MessageStatus";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isMe: boolean;
  senderName?: string;
  avatarUrl?: string;
  status?: 'sent' | 'delivered' | 'read' | 'deleted';
}

export const ChatBubble = ({
  message,
  timestamp,
  isMe,
  senderName,
  avatarUrl,
  status,
}: ChatBubbleProps) => {
  return (
    <div
      className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {!isMe && (
        <div className="mr-2 mt-1 shrink-0">
          {" "}
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

          {isMe && <MessageStatusIcon status={status} />}
          <div
            className={`
              px-4 py-2 text-sm break-words shadow-sm
              ${status === 'deleted' ? 'italic opacity-70' : ''}
              ${
                isMe
                  ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg rounded-br-none"
                  : "bg-white text-gray-900 border border-gray-200 rounded-r-lg rounded-tl-lg rounded-bl-none"
              }
            `}
          >
            {status === 'deleted' ? 'This message was deleted' : message}
          </div>
        </div>
      </div>
    </div>
  );
};
