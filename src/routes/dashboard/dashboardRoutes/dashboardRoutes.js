import express from "express";
import { BannerRouter } from "./../BannerRouter.js";
import { BrandRouter } from "./../BrandRouter.js";
import { CategoryRouter } from "../CategoryRouter.js";
import { ProductRouter } from "../ProductRouter.js";
import { SubCategoryRouter } from "../SubCategoryRouter.js";

export const dashboardRoutes = express.Router();
dashboardRoutes.use("/banners", BannerRouter);
dashboardRoutes.use("/brands", BrandRouter);
dashboardRoutes.use("/categories", CategoryRouter);
dashboardRoutes.use("/sub-categories", SubCategoryRouter);
dashboardRoutes.use("/products", ProductRouter);
