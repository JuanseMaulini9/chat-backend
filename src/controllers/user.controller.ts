import { Response, Request } from "express";
import User from "../schemas/user.schema";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error: unknown) {
    if (typeof error === "string") {
      return res.status(500).json({ error });
    } else if (error instanceof Error) return res.status(500).json({ error });
  }
};
