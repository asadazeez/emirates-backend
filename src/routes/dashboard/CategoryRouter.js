import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getCategoryId,
  getCategoryList,
  updateCategory,
} from "../../controllers/dashboard/CategoryController.js";
import { uploadImageFile } from "../../utils/fileUploader.js";

export const CategoryRouter = express.Router();
CategoryRouter.get("/category-list", getCategoryList);
CategoryRouter.get("/all-categories", getAllCategory);
CategoryRouter.get("/:categoryId", getCategoryId);
CategoryRouter.post(
  "/",
  uploadImageFile("categories").single("imageFile"),
  addCategory
);
CategoryRouter.put(
  "/:categoryId",
  uploadImageFile("categories").single("imageFile"),
  updateCategory
);
CategoryRouter.delete("/:categoryId", deleteCategory);
