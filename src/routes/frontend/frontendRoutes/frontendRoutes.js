import express from "express";

import { UserRouter } from "../userRouter.js";
import { LandingPageRouter } from "../LandingPageRouter.js";

export const frontendRoutes = express.Router();
frontendRoutes.use("/user", UserRouter);
frontendRoutes.use("/home-page", LandingPageRouter);
