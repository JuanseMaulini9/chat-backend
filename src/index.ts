import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";
import connectToMongo from "./db/connnectMongoDb";
import { UserInterface } from "./types";
import cors from "cors";
import { app, server } from "./socket/socket";
// NO SE COMO ESTO FUNCIONA PERO FUNCIONA XD
declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }
  }
}

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
  connectToMongo();
  console.log(`Server en el puerto: ${PORT}`);
});
