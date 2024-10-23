import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },

    image: {
      type: String,
      required: true,
    },

    deletedAt: {
      type: Date,
      required: false,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const SubCategoryModel = mongoose.model("subcategories", subCategorySchema);
