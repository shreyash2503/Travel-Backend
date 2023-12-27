import express, { RequestHandler } from "express";
import { login, logout, signUp } from "../controllers/auth.controller";
import {
  addImage,
  resizeImage,
  updateUser,
  uploadFiles,
} from "../controllers/user.controller";
import { protect } from "../utils/deserializeUser";

const Router = express.Router();

Router.post("/signup", signUp as RequestHandler);
Router.post("/login", login as RequestHandler);
Router.get("/logout", logout as RequestHandler);

Router.patch(
  "/updateMe",
  protect as RequestHandler,
  uploadFiles as RequestHandler,
  resizeImage(500) as RequestHandler,
  addImage as RequestHandler,
  updateUser as RequestHandler
);

export default Router;
