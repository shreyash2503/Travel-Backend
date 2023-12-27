import mongoose, { UpdateQuery } from "mongoose";
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

export const getOne = (Model: mongoose.Model<any>, popOption: Object | null) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = await Model.findById({ _id: req.params.id });
    if (popOption) {
      query = query.populate(popOption);
    }
    const doc = await query;

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

export const updateOne = <T>(Model: mongoose.Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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

export const deleteOne = <T>(Model: mongoose.Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new Error("No document found with that ID"));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
