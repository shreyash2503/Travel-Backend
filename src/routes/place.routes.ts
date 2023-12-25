import express from "express";
import { RequestHandler } from "express";
import mongoose from "mongoose";
import { protect } from "../utils/deserializeUser";
import { createPlace } from "../controllers/place.controller";
import checkCity from "../utils/checkCity";

const Router = express.Router();

Router.route("/")
  .get(protect as RequestHandler)
  .post(
    protect as RequestHandler,
    checkCity as RequestHandler,
    createPlace as RequestHandler
  );

export default Router;
