import { Request, Response } from "express";
import User from "../schemas/user.schema";
import { UserInterface } from "../types";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "No coinciden las contraseñas" });
    }

    const user: UserInterface | null = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "el username ya esta en uso" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      username,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id.toString(), res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ message: "datos no validos" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user?.password) {
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!user || !passwordCorrect) {
        return res
          .status(400)
          .json({ message: "username o password incorrectos" });
      }
      generateToken(user._id.toString(), res);
      res.status(200).json({
        _id: user._id,
        fullname: user.fullName,
        username: user.username,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const logout = (_req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json("deslogeado");
  } catch (error) {
    res.send(500).json({ error: error });
  }
};
