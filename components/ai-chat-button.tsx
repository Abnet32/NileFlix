"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type AiChatButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function AiChatButton({ isOpen, onClick }: AiChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
        isOpen
          ? "bg-destructive text-destructive-foreground"
          : "bg-linear-to-br from-primary via-primary to-violet-500 text-primary-foreground animate-pulse",
      )}
    >
      {isOpen ? (
        <MessageCircle className="size-6" />
      ) : (
        <Sparkles className="size-6" />
      )}
      {!isOpen && (
        <span className="absolute -top-0.5 -right-0.5 flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-green-500" />
        </span>
      )}
    </button>
  );
}
