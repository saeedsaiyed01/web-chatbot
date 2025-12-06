"use client";

import { useEffect, useRef } from "react";
import { Message } from "../libs/types";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          from={m.from}
          text={m.text}
          payload={m.payload}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
