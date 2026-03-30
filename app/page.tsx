"use client";

import { useState } from "react";
import { ChatRoom } from "@/components/chat-room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUsername(inputValue.trim());
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Join Live Chat</CardTitle>
            <CardDescription>
              Enter your username to start chatting with others in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your username"
                maxLength={20}
              />
              <Button type="submit" disabled={!inputValue.trim()}>
                Join Chat
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <ChatRoom username={username} />
    </main>
  );
}
