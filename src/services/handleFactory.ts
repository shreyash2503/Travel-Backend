import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { Response, Request, NextFunction } from "express";

export const createOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
