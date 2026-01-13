"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type MessageType = "success" | "error" | "info" | "warning";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  duration?: number;
}

interface MessageContextType {
  addMessage: (type: MessageType, content: string, duration?: number) => void;
  removeMessage: (id: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

// Global reference for the message utility
let addMessageGlobal:
  | ((type: MessageType, content: string, duration?: number) => void)
  | null = null;

export const message = {
  success: (content: string, duration?: number) => {
    if (addMessageGlobal) addMessageGlobal("success", content, duration);
  },
  error: (content: string, duration?: number) => {
    if (addMessageGlobal) addMessageGlobal("error", content, duration);
  },
  info: (content: string, duration?: number) => {
    if (addMessageGlobal) addMessageGlobal("info", content, duration);
  },
  warning: (content: string, duration?: number) => {
    if (addMessageGlobal) addMessageGlobal("warning", content, duration);
  },
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const addMessage = useCallback(
    (type: MessageType, content: string, duration = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newMessage: Message = { id, type, content, duration };

      setMessages((prev) => [...prev, newMessage]);

      if (duration > 0) {
        setTimeout(() => {
          removeMessage(id);
        }, duration);
      }
    },
    [removeMessage]
  );

  // Register the global reference
  useEffect(() => {
    addMessageGlobal = addMessage;
    return () => {
      addMessageGlobal = null;
    };
  }, [addMessage]);

  return (
    <MessageContext.Provider value={{ addMessage, removeMessage }}>
      {children}
      <MessageContainer messages={messages} onRemove={removeMessage} />
    </MessageContext.Provider>
  );
};

import { MessageContainer } from "./MessageContainer";
