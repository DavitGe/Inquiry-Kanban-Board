import React from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { Message } from "./MessageContext";

interface MessageItemProps {
  message: Message;
  onRemove: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onRemove,
}) => {
  const { type, content } = message;

  const bgColors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  return (
    <div
      className={`
        pointer-events-auto px-4 py-3 flex items-center gap-3 rounded-lg border shadow-sm animate-in fade-in slide-in-from-top-4 duration-300
        ${bgColors[type]}
      `}
      role="alert"
    >
      <span className="shrink-0">{icons[type]}</span>
      <p className="font-medium text-sm">{content}</p>
      <button
        onClick={onRemove}
        className="ml-auto p-1 rounded-full transition-colors hover:bg-black/5"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </div>
  );
};
