import mongoose from "mongoose";
import { ProductModel } from "../../models/ProductModel.js";
import { serverError, validationError } from "../../utils/errorHandler.js";
import dayjs from "dayjs";
import { BrandModel } from "../../models/BrandModel.js";
import { CategoryModel } from "../../models/CategoryModel.js";
import { getFilePath } from "../../utils/filePath.js";
import { SubCategoryModel } from "../../models/SubCategoryModel.js";

export const addProduct = async (req, res, next) => {
  try {
    const { name, description, brands, price, offerPrice, category,subCategory } = req.body;
    if (!name) {
      return res.status(422).json({
        success: false,
        message: "name is mandatory",
      });
    }
    const image = getFilePath(req.file);

    await ProductModel.create({
      name,
      description,
      price,
      brand: brands,
      image,
      category,
      subCategory,
      offerPrice,
      deletedAt: null,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const getProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = (
      await ProductModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productId),
            deletedAt: null,
          },
        },
        {
          $lookup: {
            from: BrandModel.modelName,
            localField: "brand",
            foreignField: "_id",
            pipeline: [
              {
                $match: {
                  deletedAt: null,
                },
              },
              {
                $project: {
                  _id: 0,
                  brandName: 1,
                },
              },
            ],
            as: "brandDetails",
          },
        },
        {
          $lookup: {
            from: SubCategoryModel.modelName,
            localField: "subCategory",
            foreignField: "_id",
            pipeline: [
              {
                $match: {
                  deletedAt: null,
                },
              },
              {
                $project: {
                  _id: 0,
                  name: 1,
                },
              },
            ],
            as: "subCategoryDetails",
          },
        },
        {
          $lookup: {
            from: CategoryModel.modelName,
            localField: "category",
            foreignField: "_id",
            pipeline: [
              {
                $match: {
                  deletedAt: null,
                },
              },
              {
                $project: {
                  _id: 0,
                  categoryName: 1,
                },
              },
            ],
            as: "categoryDetails",
          },
        },
        {
          $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: {
            path: "$subCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            offerPrice: 1,
            brand: 1,
            category: 1,
            image: 1,
            brandName: "$brandDetails.brandName",
            categoryName: "$categoryDetails.categoryName",
            subCategoryName: "$subCategoryDetails.name",
          },
        },
      ])
    ).at(0);

    if (!product) {
      return next(validationError("Product not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Product Retrieved successfully",
      data: product,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const products = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: BrandModel.modelName,
          localField: "brand",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                deletedAt: null,
              },
            },
            {
              $project: {
                _id: 0,
                brandName: 1,
              },
            },
          ],
          as: "brand",
        },
      },
      {
        $lookup: {
          from: CategoryModel.modelName,
          localField: "category",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                deletedAt: null,
              },
            },
            {
              $project: {
                _id: 0,
                categoryName: 1,
              },
            },
          ],
          as: "category",
        },
      },
      {
        $unwind: { path: "$brand", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          brand: "$brand.brandName",
          category: "$category.categoryName",
          offerProduct: 1,
          image: 1,
          offerPrice:1
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Products Retrieved successfully",
      data: products,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      price,
      offerPrice,
      brand,
      category,
      subCategory,
    } = req.body;

    if (!name) {
      return res.status(422).json({
        success: false,
        message: "name is mandatory",
      });
    }

    const product = await ProductModel.findOne({
      _id: productId,
      deletedAt: null,
    });

    if (!product) {
      return res.status(422).json({
        success: false,
        message: "Product not found",
      });
    }
    let productImage = product.image;
    if (req.file) {
      productImage = getFilePath(req.file);
    }
    product.name = name;
    product.description = description;
    product.brand = brand;
    product.price = price;
    product.category = category;
    product.image = productImage;
    product.subCategory = subCategory;
    product.offerPrice = offerPrice;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const offerProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return res.status(422).json({
        success: false,
        message: "Product not found",
      });
    }
    product.offerProduct = product.offerProduct === true ? false : true;
    await product.save();

    return res.status(200).json({
      success: true,
      message: product.offerProduct
        ? "Product is on Offer"
        : " Product is not on Offer",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      return res.status(422).json({
        success: false,
        message: "Product not found",
      });
    }

    product.deletedAt = dayjs().toDate();
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};
