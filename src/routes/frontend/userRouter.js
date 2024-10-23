import express from "express";
import {
  CreateUser,
  UpdateUser,
  UserLogin,
} from "../../controllers/frontend/UserController.js";

export const UserRouter = express.Router();
UserRouter.post("/create/", CreateUser);
UserRouter.post("/login/", UserLogin);
UserRouter.post("/update/", UpdateUser);
