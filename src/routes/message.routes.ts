import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
