import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../services/handleFactory";
import { Review } from "../models/review.model";

export const createReview = createOne(Review);

export const getAllReviews = getAll(Review);

export const getReview = getOne(Review, null);

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);
