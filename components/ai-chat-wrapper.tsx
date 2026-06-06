"use client";

import { useState } from "react";
import AiChatButton from "@/components/ai-chat-button";
import AiChat from "@/components/ai-chat";

export default function AiChatWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AiChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <AiChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
