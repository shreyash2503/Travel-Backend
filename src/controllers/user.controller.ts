import mongoose from "mongoose";
import { createOne } from "../services/handleFactory";
import { User } from "../models/user.model";

export const createUser = createOne(User);
