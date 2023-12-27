import { Request, Response, NextFunction } from "express";

export const assignUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.user) {
    return next(new Error("You are not logged in! Please login and try again"));
  }
  req.body.user = res.locals.user._id;
  next();
};
