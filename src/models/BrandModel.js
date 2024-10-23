import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required:true
      


    },
    description: {
      type: String,
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export const BrandModel = mongoose.model("brands", brandSchema);
