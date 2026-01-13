"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ModalProps, ModalSize } from "./Modal.types";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[95%] h-[95vh]",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
  overlayClassName = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay Backdrop */}
      <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-[2px] pointer-events-none" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`relative w-full bg-white rounded-xl shadow-xl transform transition-all duration-300 scale-100 opacity-100 flex flex-col max-h-[90vh] border border-zinc-200 ${sizeClasses[size]} ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 shrink-0">
            {title && (
              <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 transition-colors rounded-lg hover:bg-zinc-50"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};
