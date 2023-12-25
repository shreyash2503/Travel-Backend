import mongoose, { Aggregate } from "mongoose";
import slugify from "slugify";
import { UserDocument } from "./user.model";

export interface PlaceDocument extends mongoose.Document {
  name: string;
  country: string;
  price: number;
  rating: number;
  speciality: Array<string>;
  images: Array<string>;
  location: {
    type: string;
    coordinates: number[];
    iatCode: string;
    address: { countryCode: string; stateCode: string };
  };
  user: UserDocument;
  slug: string;
}

const placeSchema = new mongoose.Schema<PlaceDocument>(
  {
    name: {
      type: String,
      required: [true, "A name is required for the place"],
      unique: true,
      trim: true,
      lowercase: true,
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
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      iatCode: String,
      address: {
        type: {
          countryCode: String,
          stateCode: String,
        },
      },
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
      type: [String],
    },
    images: {
      type: [String],
    },
    slug: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A place must be created by an user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

placeSchema.index({ slug: 1 });

placeSchema.pre("save", function (this: PlaceDocument, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export const Place = mongoose.model<PlaceDocument>("place", placeSchema);
