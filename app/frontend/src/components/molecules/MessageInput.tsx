import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput = ({
  onSendMessage,
  onTyping,
  placeholder = "Type your message...",
  disabled = false,
}: MessageInputProps) => {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    onTyping?.(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTyping?.(false);
    }, 1500);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage("");
    onTyping?.(false);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, []);

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
