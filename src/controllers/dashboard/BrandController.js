import mongoose from "mongoose";
import { BrandModel } from "../../models/BrandModel.js";
import { serverError, validationError } from "../../utils/errorHandler.js";
import dayjs from "dayjs";
import { getFilePath } from "../../utils/filePath.js";
import { ProductModel } from "../../models/ProductModel.js";

export const addBrand = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      next(validationError("Name is required"));
    }

    const image = getFilePath(req.file);
    await BrandModel.create({
      brandName: name,
      description: description,
      image,
      deletedAt: null,
    });
    return res.status(200).json({
      success: true,
      message: "Brand added successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const getBrandId = async (req, res, next) => {
  try {
    const { brandId } = req.params;


    const brand = (
      await BrandModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(brandId),
            deletedAt: null,
          },
        },
        {
          $project: {
            brandName: 1,
            description: 1,
            _id: 1,
            image: 1,
          },
        },
      ])
    ).at(0);
    if (!brand) {
      return res.status(422).json({
        success: false,
        message: "Brand not found",
        data: brand,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Brand Retrieved successfully",
      data: brand,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const getBrandList = async (req, res, next) => {
  try {
    const brands = await BrandModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $project: {
          name: "$brandName",
          id: 1,
        },
      },
    ]);

    if (!brands) {
      return res.status(422).json({
        success: false,
        message: "Brand not found",
        data: brands,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Brand Retrieved successfully",
      data: brands,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const getAllBrand = async (req, res, next) => {
  try {
    const brands = await BrandModel.aggregate([
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
          brandName: 1,
          description: 1,
          _id: 1,
        image: 1,
        },
      },
    ]);
    if (!brands) {
      next(validationError("Brand not found"));
    }
    return res.status(200).json({
      success: true,
      message: "Brand Retrieved successfully",
      data: { brands: brands },
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(422).json({
        success: false,
        message: "name is required",
      });
    }
    const brand = await BrandModel.findOne({ _id: brandId, deletedAt: null });
    if (!name) {
      return res.status(422).json({
        success: false,
        message: "Brand not found",
      });
    }

    let brandLogo = brand.image;
    if (req.file) {
      brandLogo = getFilePath(req.file);
    }

    brand.brandName = name;
    brand.description = description;
    brand.image = brandLogo;
    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand Updated Successfully",
    });
  } catch (error) {
    next(serverError(error));
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const brand = await BrandModel.findOne({ _id: brandId, deletedAt: null });
    if (!brand) {
      return res.status(422).json({
        success: false,
        message: "Brand not found",
      });
    }
    const products = await ProductModel.find({
      brand: brandId,
      deletedAt: null,
    });
    if (products && products.length > 0) {
      return res.status(201).json({
        success: false,
        message:
          "This brand cannot be deleted because it is currently assigned to one or more products. ",
      });
    }
    brand.deletedAt = dayjs();
    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand deleted Successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

