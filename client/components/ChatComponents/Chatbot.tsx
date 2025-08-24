"use client";

import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { GlobeIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { BorderBeam } from "../magicui/border-beam";

interface MessageType {
  id: string;
  role: "user" | "assistant";
  text: string;
  temporary?: boolean;
}

const Chatbot = () => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;

    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    const thinkingMessage: MessageType = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Thinking...",
      temporary: true,
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.map((m) => ({ role: m.role, content: m.text })), { role: "user", content: userMessage.text }],
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");
      const data = await res.json();

      // Replace temporary message with real response
      setMessages((prev) =>
        prev.map((m) =>
          m.temporary ? { ...m, text: data.text || "No response", temporary: false } : m
        )
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.temporary ? { ...m, text: "Error fetching response", temporary: false } : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col rounded-lg border dark:bg-gray-900 relative">
      <div className="flex-1 overflow-auto mb-4 w-full">
        <Conversation className="w-full">
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  <Response>{message.text}</Response>
                </MessageContent>
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <PromptInput
        onSubmit={handleSubmit}
        className="fixed bottom-5 2xl:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl 2xl:max-w-4xl dark:bg-gray-800 shadow-sm shadow-amber-400 dark:shadow-amber-500"
      >
        <BorderBeam duration={6} size={100} borderWidth={2} />
        <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton disabled={loading}>
              <GlobeIcon size={16} />
              <span>Send</span>
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit disabled={!text || loading} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default Chatbot;
