import mongoose from "mongoose";
import { serverError, validationError } from "../../utils/errorHandler.js";
import dayjs from "dayjs";
import { getFilePath } from "../../utils/filePath.js";
import { ProductModel } from "../../models/ProductModel.js";
import { SubCategoryModel } from "../../models/SubCategoryModel.js";

export const addSubCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      next(validationError("Name is required"));
    }

    const image = getFilePath(req?.file);

    await SubCategoryModel.create({
      name: name,
      description: description,
      image,
      deleteAt: null,
    });
    return res.status(200).json({
      success: true,
      message: "Sub-Category added successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};
export const getSubCategoryId = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const subCategory = (
      await SubCategoryModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(subCategoryId),
            deleteAt: null,
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            _id: 1,
            image: 1,
          },
        },
      ])
    ).at(0);
    if (!subCategory) {
      return next(validationError("Sub-Category not found"));
    }
    return res.status(200).json({
      success: true,
      message: "Sub-Category Retrieved successfully",
      data: subCategory,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const getSubCategoryList = async (req, res, next) => {
  try {
    const subCategory = await SubCategoryModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },

      {
        $project: {
          name: 1,
          _id: 1,
        },
      },
    ]);
    if (!subCategory) {
      return next(validationError("Sub-Category not found"));
    }
    return res.status(200).json({
      success: true,
      message: "Sub-Category Retrieved successfully",
      data: subCategory,
    });
  } catch (error) {
    return next(serverError(error));
  }
};
export const getAllSubCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategoryModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          name: 1,
          description: 1,
          featured: 1,
          _id: 1,
        },
      },
    ]);
    if (!subCategory) {
      return next(validationError("Sub-Category not found"));
    }
    return res.status(200).json({
      success: true,
      message: "Category Retrieved successfully",
      data: subCategory,
    });
  } catch (error) {
    next(serverError(error));
  }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const { name, description } = req.body;
    if (!name) {
      return res.status(422).json({
        success: false,
        message: "name is required",
      });
    }
    const subCategory = await SubCategoryModel.findOne({
      _id: subCategoryId,
      deletedAt: null,
    });
    if (!name) {
      return res.status(422).json({
        success: false,
        message: "Sub-Category not found",
      });
    }
    let subCategoryImage = subCategory.image;

    if (req.file) {
      subCategoryImage = getFilePath(req.file);
    }
    subCategory.name = name;
    subCategory.description = description;
    subCategory.image = subCategoryImage;
    await subCategory.save();

    return res.status(200).json({
      success: true,
      message: "Sub-Category Updated Successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const featuredSubCategory = async (req, res, next) => {
  try {

    const { subCategoryId } = req.params;
    const subCategory = await SubCategoryModel.findOne({ _id: subCategoryId });

    if (!subCategory) {
      return res.status(422).json({
        success: false,
        message: "Sub-Category not found",
      });
    }
    subCategory.featured = subCategory.featured === true ? false : true;
    await subCategory.save();

    return res.status(200).json({
      success: true,
      message: subCategory.featured
        ? "Sub-Category is Featured"
        : " Sub-Category is not featured",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const deleteSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const subCategory = await SubCategoryModel.findOne({
      _id: subCategoryId,
      deletedAt: null,
    });

    if (!subCategory) {
      return res.status(422).json({
        success: false,
        message: "Sub-Category not found",
      });
    }

    const products = await ProductModel.find({
      subCategory: subCategoryId,
      deletedAt: null,
    });

    if (products && products.length > 0) {
      return res.status(201).json({
        success: false,
        message:
          "This sub-category cannot be deleted because it is currently assigned to one or more products. ",
      });
    }

    subCategory.deletedAt = dayjs();
    await subCategory.save();
    return res.status(200).json({
      success: true,
      message: "Sub-category deleted Successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};
