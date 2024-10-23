import express from "express";
import { LandingPage } from "../../controllers/frontend/LandingPageController.js";

export const LandingPageRouter = express.Router()

LandingPageRouter.get("/",LandingPage)