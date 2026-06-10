"use client";

import { useCallback, useEffect, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const CHAT_HISTORY_KEY = "nileflix:ai-chat-history";
const MAX_MESSAGES = 100;

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

function saveMessages(msgs: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES)));
  } catch {
    // ignore
  }
}

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMessages(loadMessages());
    setMounted(true);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessages(updated);
    setIsLoading(true);

    const assistantId = generateId();
    let streamed = "";

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      // Errors arrive as JSON (before the stream starts); success streams text.
      const contentType = res.headers.get("Content-Type") ?? "";
      if (!res.ok || contentType.includes("application/json")) {
        const data = await res.json().catch(() => ({}));
        setMessages((prev) => {
          const final: ChatMessage[] = [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content:
                data.error ??
                "Sorry, I couldn't respond right now. Please try again.",
              timestamp: Date.now(),
            },
          ];
          saveMessages(final);
          return final;
        });
        return;
      }

      // Add an empty assistant bubble, then fill it as chunks stream in.
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        },
      ]);
      setIsLoading(false);

      const reader = res.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          streamed += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: streamed } : m,
            ),
          );
        }
      }

      const finalText = streamed || "Sorry, I couldn't generate a response.";
      setMessages((prev) => {
        const final = prev.map((m) =>
          m.id === assistantId ? { ...m, content: finalText } : m,
        );
        saveMessages(final);
        return final;
      });
    } catch {
      const fallback =
        "Something went wrong. Please check your connection and try again.";
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === assistantId);
        const final = exists
          ? prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: streamed || fallback }
                : m,
            )
          : [
              ...prev,
              {
                id: assistantId,
                role: "assistant" as const,
                content: fallback,
                timestamp: Date.now(),
              },
            ];
        saveMessages(final);
        return final;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    saveMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    mounted,
  };
}
