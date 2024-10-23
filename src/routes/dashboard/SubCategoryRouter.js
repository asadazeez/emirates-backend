import express from "express";

import { uploadImageFile } from "../../utils/fileUploader.js";
import { addSubCategory, deleteSubCategory, featuredSubCategory, getAllSubCategory, getSubCategoryId, getSubCategoryList, updateSubCategory } from "../../controllers/dashboard/SubCategoryController.js";

export const SubCategoryRouter = express.Router();
SubCategoryRouter.get("/subcategory-list", getSubCategoryList);
SubCategoryRouter.get("/all-subcategories", getAllSubCategory);
SubCategoryRouter.get("/:subCategoryId", getSubCategoryId);
SubCategoryRouter.post(
  "/",
  uploadImageFile("subcategories").single("imageFile"),
  addSubCategory
);
SubCategoryRouter.put(
  "/:subCategoryId",
  uploadImageFile("subcategories").single("imageFile"),
  updateSubCategory
);
SubCategoryRouter.delete("/:subCategoryId", deleteSubCategory);
SubCategoryRouter.post("/featured/:subCategoryId", featuredSubCategory);
