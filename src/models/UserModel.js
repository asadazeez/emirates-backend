import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      required: false,
      deletedAt: null,
    },
  },
  { timestamps: true }
);
export const UserModel = mongoose.model("users", userSchema);
