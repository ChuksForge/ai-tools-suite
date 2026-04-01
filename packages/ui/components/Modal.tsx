"use client";

import { cn } from "../utils";
import { useEffect, HTMLAttributes } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg bg-card border border-border p-6 shadow-2xl",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              [ESC]
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}