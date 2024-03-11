import jwt from "jsonwebtoken";
import User from "../schemas/user.schema";
import { TokenPayload } from "../types";
import { Response, NextFunction, Request } from "express";

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "No hay token" });
    }
    if (typeof process.env.JWT_SECRET === "string") {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
      if (!decoded) {
        return res.status(401).json({ error: "Se decodifica raro" });
      }
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "usuario no encontrado" });
      }
      req.user = user;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default protectRoute;
