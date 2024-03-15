import { Types } from "mongoose";

export interface UserInterface {
  _id: Types.ObjectId;
  fullname: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageInterface {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatInterface {
  participants: [Types.ObjectId];
  messages: [Types.ObjectId];
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPayload {
  userId: string;
}

export interface UserSocketMap {
  [userId: string]: string;
}
