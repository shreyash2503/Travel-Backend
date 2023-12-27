import express from "express";
import { RequestHandler } from "express";
import { protect } from "../utils/deserializeUser";
import {
  createPlace,
  getPlaces,
  getPlace,
  updatePlace,
} from "../controllers/place.controller";
import checkCity from "../utils/checkCity";
import reviewRouter from "../routes/review.routes";
import { assignUserId } from "../middleware/assignUserId";

const Router = express.Router();
Router.use("/:placeId/reviews", reviewRouter as RequestHandler);

Router.route("/")
  .get(protect as RequestHandler, getPlaces as RequestHandler)
  .post(
    protect as RequestHandler,
    checkCity as RequestHandler,
    assignUserId as RequestHandler,
    createPlace as RequestHandler
  );

Router.route("/:id")
  .get(protect as RequestHandler, getPlace as RequestHandler)
  .patch(protect as RequestHandler, updatePlace as RequestHandler);

export default Router;
