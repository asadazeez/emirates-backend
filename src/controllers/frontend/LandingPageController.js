
import { serverError } from "../../utils/errorHandler.js";
import { BannerModel } from "../../models/BannerModel.js";
import { ProductModel } from "../../models/ProductModel.js";
import { CategoryModel } from "../../models/CategoryModel.js";
import { BrandModel } from "../../models/BrandModel.js";
import { SubCategoryModel } from "../../models/SubCategoryModel.js";

export const LandingPage = async (req, res, next) => {
  try {
    const banner = (
      await BannerModel.aggregate([
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
            image: 1,
            _id: 1,
            category: 1,
          },
        },
      ])
    ).at(0);
    
    const category = await CategoryModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      }, 
   
      {
        $project: {
          name: "$categoryName",
          image: 1,
        },
      },
    ]);

    const brand = await BrandModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $limit:4
      },

      {
        $project: {
          name: "$brandName",
          image: 1,
        },
      },
    ]);

    const products = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
          offerProduct:false
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
        $unwind: { path: "$brand", preserveNullAndEmptyArrays: true },
      },
  
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          brand: "$brand.brandName",
          offerProduct: 1,
          image: 1,
          offerPrice: 1,
        },
      },
    ]);


    const offerProduct = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
          offerProduct: true,
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
        $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $project: {
          name: 1,
          image: 1,
          price: 1,
          brandName: "$brandDetails.brandName",
          offerPrice:1,
          _id: 1,
        },
      },
    ]);

    const productBySubCategory = (
      await SubCategoryModel.aggregate([
        {
          $match: {
            deletedAt: null,
            featured: true,
          },
        },
        {
          $lookup: {
            from: ProductModel.modelName,
            localField: "_id",
            foreignField: "subCategory",
            pipeline: [
              {
                $match: {
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
                  as: "brand",
                },
              },
              {
                $unwind: {
                  path: "$brand",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $project: {
                  name: 1,
                  image: 1,
                  brand: "$brand.brandName",
                  price: 1,
                  offerPrice: 1,
                },
              },
            ],
            as: "subCategoryProduct",
          },
        },
        {
          $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $limit: 1,
        },

        {
          $project: {
            _id: 0,
            name: 1,
            subCategoryProduct: 1,
          },
        },
      ])
    ).at(0);
      

    return res.status(200).json({
      success: true,
      data: {
        brand: brand,
        category: category,
        banner: banner,
        offerProduct: offerProduct,
        products: products,
        productBySubCategory: productBySubCategory,
      },
    });
  } catch (error) {
    return next(serverError(error));
  }
};

