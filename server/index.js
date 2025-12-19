import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("join-room", roomId => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("chat-message", ({ roomId, message }) => {
    io.to(roomId).emit("chat-message", message);
  });

  // WebRTC signaling
  socket.on("offer", data => socket.to(data.roomId).emit("offer", data));
  socket.on("answer", data => socket.to(data.roomId).emit("answer", data));
  socket.on("ice-candidate", data =>
    socket.to(data.roomId).emit("ice-candidate", data)
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
