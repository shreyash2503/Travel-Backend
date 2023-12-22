import express, { RequestHandler } from "express";
import { login, logout, signUp } from "../controllers/auth.controller";

const Router = express.Router();

Router.post("/signup", signUp as RequestHandler);
Router.post("/login", login as RequestHandler);
Router.get("/logout", logout as RequestHandler);

export default Router;
