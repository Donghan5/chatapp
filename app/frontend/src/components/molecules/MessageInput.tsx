import React, { useState, FormEvent } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput = ({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start gap-2 p-4 bg-white border-t border-gray-200"
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        containerClassName="flex-1"
        className="rounded-full"
      />

      <Button
        type="submit"
        variant="send"
        disabled={!message.trim() || disabled}
        className="shrink-0 rounded-full px-6"
      >
        Send
      </Button>
    </form>
  );
};
