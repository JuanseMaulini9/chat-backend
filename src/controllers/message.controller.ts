import { Response, Request } from "express";
import Chat from "../schemas/chat.schema";
import Message from "../schemas/message.schema";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let chat = await Chat.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      content: message,
    });

    if (newMessage) {
      chat.messages.push(newMessage._id);
    }

    await chat.save();
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("Receiver Socket ID:", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log("se envio el mensaje: ", newMessage);
    }

    res.status(201).json({ newMessage });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Chat.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error });
  }
};
