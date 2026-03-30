"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export function useSocket(
  username: string,
  onMessage: (message: Message) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io({
      path: "/socket.io",
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      socketRef.current?.emit("join", username);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("message", (message: Message) => {
      onMessage(message);
    });

    socketRef.current.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [onMessage, username]);

  const sendMessage = useCallback((text: string) => {
    if (socketRef.current) {
      socketRef.current.emit("message", { username, text });
    }
  }, [username]);

  return { sendMessage, onlineUsers, isConnected };
}
