import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // update if needed
    credentials: true,
  },
});

// used to store online users
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Group channel events
  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
    console.log(`${socket.id} joined channel ${channelId}`);
  });

  socket.on("leaveChannel", (channelId) => {
    socket.leave(channelId);
    console.log(`${socket.id} left channel ${channelId}`);
  });

  socket.on("sendChannelMessage", ({ channelId, message }) => {
    console.log(`Sending to channel ${channelId}:`, message);
    socket.to(channelId).emit("newChannelMessage", message);
  });

  socket.on("sendDirectMessage", ({ receiverId, message }) => {
    console.log(`Direct message received for ${receiverId}:`, message);

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
    }
});


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
