"use client";

import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { GlobeIcon, MicIcon } from "lucide-react";
import { useState } from "react";
import { Chat, useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

const models = [
  { id: "Gemini", name: "Gemini-2.5-Flash" },
  //   { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
];

const Chatbot = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const { messages, status, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(
      { text },
      {
        body: { model },
      }
    );
    setText("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 h-full flex flex-col rounded-lg border dark:bg-gray-900">
      {/* Messages scrollable area */}
      <div className="relative z-0">
          <div className="flex-1 overflow-auto mb-4">
            <Conversation>
              <ConversationContent>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        }
                        return null;
                      })}
                    </MessageContent>
                  </Message>
                ))}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
      </div>

      {/* Fixed prompt input */}
      <PromptInput onSubmit={handleSubmit} className="-mt-14 z-10 w-full">
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
            <PromptInputModelSelect
              onValueChange={(value) => setModel(value)}
              value={model}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((m) => (
                  <PromptInputModelSelectItem key={m.id} value={m.id}>
                    {m.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit disabled={!text} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default Chatbot;
