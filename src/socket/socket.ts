import { Server } from "socket.io";
import http from "http";
import express from "express";
import { UserSocketMap } from "../types";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${process.env.FRONTEND_URL}`],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

const userSocketMap: UserSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (typeof userId === "string") {
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
    });
  }
});
export { app, io, server };
