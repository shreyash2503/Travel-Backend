import express, { RequestHandler } from "express";
import { createUser } from "../controllers/user.controller";

const Router = express.Router();

Router.post("/signup", createUser as RequestHandler);

export default Router;
