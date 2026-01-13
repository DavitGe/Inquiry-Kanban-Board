import React from "react";
import { Message } from "./MessageContext";
import { MessageItem } from "./MessageItem";

interface MessageContainerProps {
  messages: Message[];
  onRemove: (id: string) => void;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  messages,
  onRemove,
}) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-2 pointer-events-none">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          onRemove={() => onRemove(msg.id)}
        />
      ))}
    </div>
  );
};
