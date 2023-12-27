import express, { RequestHandler } from "express";
import { protect } from "../utils/deserializeUser";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} from "../controllers/review.controller";
import { assignUserId } from "../middleware/assignUserId";
// import { createReview } from "../controllers/place.controller";

const Router = express.Router({ mergeParams: true });

Router.use(protect as RequestHandler);

Router.route("/")
  .post(
    protect as RequestHandler,
    assignUserId as RequestHandler,
    createReview as RequestHandler
  )
  .get(protect as RequestHandler, getAllReviews as RequestHandler);

Router.route("/:id")
  .get(protect as RequestHandler, getReview as RequestHandler)
  .patch(protect as RequestHandler, updateReview as RequestHandler)
  .delete(protect as RequestHandler, deleteReview as RequestHandler);

export default Router;
