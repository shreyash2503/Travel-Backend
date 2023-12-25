import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import e, { Response, Request, NextFunction } from "express";

export const createOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findById({ _id: req.params.id });
    if (!doc) {
      return next(new Error("No document found with that ID"));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.find();
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
