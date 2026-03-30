import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Track online users: Map<socketId, username>
  const onlineUsers = new Map();

  const broadcastOnlineUsers = () => {
    const users = Array.from(onlineUsers.values());
    io.emit("onlineUsers", users);
  };

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (username) => {
      onlineUsers.set(socket.id, username);
      console.log(`${username} joined the chat`);
      broadcastOnlineUsers();
      
      // Notify others that user joined
      socket.broadcast.emit("message", {
        id: Date.now().toString(),
        username: "System",
        text: `${username} joined the chat`,
        timestamp: new Date().toISOString(),
        isSystem: true,
      });
    });

    socket.on("message", (data) => {
      // Broadcast message to all connected clients
      io.emit("message", {
        id: Date.now().toString(),
        username: data.username,
        text: data.text,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);
      if (username) {
        onlineUsers.delete(socket.id);
        console.log(`${username} left the chat`);
        broadcastOnlineUsers();
        
        // Notify others that user left
        io.emit("message", {
          id: Date.now().toString(),
          username: "System",
          text: `${username} left the chat`,
          timestamp: new Date().toISOString(),
          isSystem: true,
        });
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
