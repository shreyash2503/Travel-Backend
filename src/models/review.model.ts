import mongoose, { Query } from "mongoose";
import { PlaceDocument } from "./place.model";
import { UserDocument } from "./user.model";

interface ReviewDocument extends mongoose.Document {
  review: string;
  rating: number;
  explore: [string];
  place: PlaceDocument;
  user: UserDocument;
}

const reviewSchema = new mongoose.Schema<ReviewDocument>(
  {
    review: {
      type: String,
      required: [true, "A review must have a description"],
      minLength: [10, "A review must have atleast 10 characters"],
      maxlength: [1000, "A review must have less than 1000 characters"],
    },
    rating: {
      type: Number,
      require: true,
      min: [1, "The rating must be greater than 1"],
      max: [5, "The rating must be less than 5"],
    },
    explore: {
      // Places he/she recommends to visit
      type: [String],
    },
    place: {
      type: mongoose.Schema.ObjectId,
      ref: "Place",
      required: [true, "A review must belong to a place."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A user must belong to a user."],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.statics.findbyuser = async function (tourId) {};

reviewSchema.pre<Query<ReviewDocument, ReviewDocument>>(
  /^find/,
  function (next) {
    this.populate({
      path: "user",
      select: "name photo",
    });
    this.select("-__v -createdAt -updatedAt");
    next();
  }
);

// reviewSchema.statics.calcAverageRatings = async function (placeId : string){
//   const stats = await this.aggregate([
//     {
//       $match : {place : placeId}
//     },
//     {
//       $group : {
//         _id : '$place'

//       }
//     }
//   ])
// }

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
