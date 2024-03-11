import mongoose from "mongoose";
import { UserInterface } from "../types";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserInterface>("User", userSchema);
export default User;
