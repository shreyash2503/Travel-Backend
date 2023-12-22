import mongoose from "mongoose";

interface PlaceDocument extends mongoose.Document {}

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required for the place"],
      unique: true,
      trim: true,
      maxLength: [
        50,
        "A place name must be less than or equal to 50 characters",
      ],
    },
    country: {
      type: String,
      required: [true, "A country name is required for the place provided"],
      trim: true,
      minLength: [2, "A country name must contain atleast two characters"],
    },
    price: {
      type: Number,
      required: [true, "What is the minimum cost you spend is required"],
    },
    rating: {
      type: Number,
      default: 1,
    },
    speciality: {
      type: Array<String>,
    },
    images: {
      type: Array<String>,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
