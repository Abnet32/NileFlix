"use client";

import { useCallback, useEffect, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const CHAT_HISTORY_KEY = "nileflix:ai-chat-history";
const CHAT_SETTINGS_KEY = "nileflix:ai-settings";
const MAX_MESSAGES = 100;

export type ChatSettings = {
  apiKey: string;
  model: string;
  endpoint?: string;
};

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

export function loadSettings(): ChatSettings {
  if (typeof window === "undefined") return { apiKey: "", model: "gpt-4o-mini" };
  try {
    const raw = localStorage.getItem(CHAT_SETTINGS_KEY);
    if (!raw) return { apiKey: "", model: "gpt-4o-mini" };
    return JSON.parse(raw) as ChatSettings;
  } catch {
    return { apiKey: "", model: "gpt-4o-mini" };
  }
}

export function saveSettings(settings: ChatSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
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
    const settings = loadSettings();
    if (!settings.apiKey) {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Please configure your AI API key first. Click the gear icon ⚙️ to set it up.",
        timestamp: Date.now(),
      };
      setMessages((prev) => {
        const updated = [...prev, errorMsg];
        saveMessages(updated);
        return updated;
      });
      return;
    }

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

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          apiKey: settings.apiKey,
          model: settings.model,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.content ?? data.error ?? "Sorry, I couldn't respond right now.",
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const final = [...prev, assistantMsg];
        saveMessages(final);
        return final;
      });
    } catch {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Something went wrong. Please check your connection and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => {
        const final = [...prev, errorMsg];
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
