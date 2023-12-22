import { Request, Response, NextFunction } from "express";
import { catchAsync } from "./catchAsync";
import jwt from "jsonwebtoken";
import config from "config";
import { User, UserDocument } from "../models/user.model";
import log from "./logger";

export interface CustomRequest extends Request {
  user: UserDocument;
}

export interface CookieResponse {
  readonly id: string;
  readonly iat: number;
  readonly exp: number;
}

export const promisify =
  (fn: Function) =>
  (...args: any[]) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err: any, data: any) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(Error("You are not logged in! Please login and try again"));
    }

    const decoded = (await promisify(jwt.verify)(
      token,
      config.get<string>("JWT_SECRET")
    )) as CookieResponse;
    // log.info(decoded);
    const freshUser = await User.findById(decoded.id);
    // log.info(freshUser);
    if (!freshUser) {
      return next(new Error("The user no longer exists"));
    }
    if (freshUser.passwordChangedAfter(decoded.iat)) {
      return next(new Error("Password is wrong"));
    }

    req.user = freshUser as UserDocument;
    res.locals.user = freshUser as UserDocument;
    next();
  }
);
