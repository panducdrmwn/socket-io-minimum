"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSocket, Message } from "@/hooks/use-socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function MessageTime({ timestamp }: { timestamp: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(
      new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [timestamp]);

  if (!time) return null;

  return (
    <span className="text-xs text-muted-foreground mt-1">{time}</span>
  );
}

export function ChatRoom({ username }: { username: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const { sendMessage, onlineUsers, isConnected } = useSocket(username, handleMessage);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            Live Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{onlineUsers.length} online</Badge>
          </div>
        </div>
        {onlineUsers.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {onlineUsers.map((user) => (
              <Badge
                key={user}
                variant={user === username ? "default" : "outline"}
                className="text-xs"
              >
                {user}
                {user === username && " (you)"}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </p>
            )}
            {messages.map((message) => {
              const isOwnMessage = message.username === username;
              const isSystem = message.isSystem;
              
              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <p className="text-xs text-muted-foreground italic py-1">
                      {message.text}
                    </p>
                  </div>
                );
              }
              
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {message.username}
                      </p>
                    )}
                    <p className="text-sm break-words">{message.text}</p>
                  </div>
                  <MessageTime timestamp={message.timestamp} />
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t flex items-center gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
