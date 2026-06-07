"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Settings, Trash2, Sparkles } from "lucide-react";
import { useAiChat, type ChatMessage } from "@/hooks/use-ai-chat";
import AiSettingsDialog from "@/components/ai-settings-dialog";
import { cn } from "@/lib/utils";

type AiChatProps = {
  isOpen: boolean;
  onClose: () => void;
};

function parseTmdbRefs(content: string): React.ReactNode[] {
  const parts = content.split(/({{(?:movie|tv):\d+}})/g);
  return parts.map((part, i) => {
    const match = part.match(/{{(movie|tv):(\d+)}}/);
    if (match) {
      const [, type, id] = match;
      const href = type === "tv" ? `/dashboard/tv/${id}` : `/dashboard/movie/${id}`;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Sparkles className="size-3" />
          View {type === "tv" ? "Show" : "Movie"}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-none px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        {isUser ? msg.content : parseTmdbRefs(msg.content)}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-none rounded-bl-md bg-muted px-4 py-3">
        <div className="flex gap-1">
          <span className="size-2 animate-bounce rounded-none bg-muted-foreground/50 [animation-delay:0s]" />
          <span className="size-2 animate-bounce rounded-none bg-muted-foreground/50 [animation-delay:0.15s]" />
          <span className="size-2 animate-bounce rounded-none bg-muted-foreground/50 [animation-delay:0.3s]" />
        </div>
      </div>
    </div>
  );
}

export default function AiChat({ isOpen, onClose }: AiChatProps) {
  const { messages, isLoading, sendMessage, clearChat, mounted } = useAiChat();
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage(text);
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-border/60 bg-background/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 sm:top-16 sm:h-[calc(100dvh-4rem)] sm:max-w-sm sm:rounded-l-2xl sm:border-t sm:border-b",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-none bg-linear-to-br from-primary to-violet-500">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">NileFlix AI</h3>
              <p className="text-[10px] text-muted-foreground">Movie recommendation assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </button>
            <button
              type="button"
              onClick={clearChat}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear chat"
            >
              <Trash2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-16 items-center justify-center rounded-none bg-muted">
                <Sparkles className="size-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Ask NileFlix AI</p>
                <p className="text-xs text-muted-foreground">
                  Get personalized movie and TV show recommendations
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Recommend a sci-fi movie",
                  "What's similar to Breaking Bad?",
                  "Best anime for beginners",
                  "Hidden gem thrillers",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="rounded-none border border-border/60 px-3 py-1.5 text-xs transition-colors hover:bg-muted"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border/60 p-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask for movie recommendations..."
              className="flex-1 rounded-none border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex size-10 shrink-0 items-center justify-center rounded-none bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <AiSettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
