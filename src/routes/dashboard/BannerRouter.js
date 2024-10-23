import express from "express";
import { uploadImageFile } from "../../utils/fileUploader.js";
import {
  addBanner,
  deleteBanner,
  getAllBanner,
  getBannerId,
  updateBanner,
} from "../../controllers/dashboard/BannerController.js";

export const BannerRouter = express.Router();

BannerRouter.get("/all-banners", getAllBanner);
BannerRouter.get("/:bannerId", getBannerId);
BannerRouter.post(
  "/",
  uploadImageFile("banners").single("imageFile"),
  addBanner
);
BannerRouter.put(
  "/:bannerId",
  uploadImageFile("banners").single("imageFile"),
  updateBanner
);
BannerRouter.delete("/:bannerId", deleteBanner);
