import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);
export const BannerModel = mongoose.model("banners", BannerSchema);
