"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Sparkles } from "lucide-react";
import { useAiChat, type ChatMessage } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "I'm feeling sad, cheer me up",
  "I want something exciting tonight",
  "Cozy anime to relax with",
  "I'm bored, surprise me",
];

function parseTmdbRefs(content: string): React.ReactNode[] {
  const parts = content.split(/({{(?:movie|tv):\d+}})/g);
  return parts.map((part, i) => {
    const match = part.match(/{{(movie|tv):(\d+)}}/);
    if (match) {
      const [, type, id] = match;
      const href =
        type === "tv" ? `/dashboard/tv/${id}` : `/dashboard/movie/${id}`;
      return (
        <a
          key={i}
          href={href}
          className="mx-0.5 inline-flex items-center gap-1 rounded-sm border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
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
          "max-w-[85%] rounded-sm px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {isUser ? msg.content : parseTmdbRefs(msg.content)}
      </div>
    </div>
  );
}

export default function AiAssistant() {
  const { messages, isLoading, sendMessage, clearChat, mounted } = useAiChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <main className="flex h-[calc(100dvh-3.5rem)] flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold">NileFlix AI</h1>
            <p className="text-xs text-muted-foreground">
              Tell me your mood, get movie, TV &amp; anime picks — powered by
              Gemini
            </p>
          </div>
        </div>
        {messages.length > 0 ? (
          <button
            type="button"
            onClick={clearChat}
            className="flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Trash2 className="size-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          {!mounted ? null : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-sm bg-muted">
                <Sparkles className="size-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">How are you feeling?</p>
                <p className="text-sm text-muted-foreground">
                  Tell me your mood and I&apos;ll suggest the perfect movie, TV
                  show, or anime to match it.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                    className="rounded-sm border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {isLoading ? (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-sm bg-muted px-4 py-3">
                    <span className="size-2 animate-bounce rounded-sm bg-muted-foreground/50 [animation-delay:0s]" />
                    <span className="size-2 animate-bounce rounded-sm bg-muted-foreground/50 [animation-delay:0.15s]" />
                    <span className="size-2 animate-bounce rounded-sm bg-muted-foreground/50 [animation-delay:0.3s]" />
                  </div>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl gap-2">
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
            placeholder="Tell me your mood…"
            disabled={isLoading}
            className="h-11 flex-1 rounded-sm border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
