import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";
import { User, UserDocument, UserInput } from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";
import { createOne } from "../services/handleFactory";
import { CookieResponse, promisify } from "../utils/deserializeUser";

const signToken = (id: string): string => {
  return jwt.sign({ id: id }, config.get<string>("JWT_SECRET"), {
    expiresIn: config.get<string>("JWT_EXPIRES_IN"),
  });
};

const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        config.get<number>("JWT_COOKIE_EXPIRES_IN") * 24 * 60 * 60 * 1000
    ),
    // httpOnly: true, // Can be sent only throught https
  };

  user.password = undefined;
  user.active = undefined;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signUp = catchAsync(
  async (
    req: Request<{}, {}, UserInput>,
    res: Response,
    next: NextFunction
  ) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(
  async (
    req: Request<{}, {}, Omit<UserInput, "passwordConfirm" | "name">>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(Error("Please provide email and password"));
    }
    const user = await User.findOne({ email: email }).select("+password");
    if (
      !user ||
      !(await user.comparePassword(password, user.password as string))
    ) {
      return next(Error("Password or email is not correct"));
    }

    createSendToken(user, 200, res);
  }
);

export const isLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.cookies.jwt) {
      try {
        token = req.cookies.jwt;
        const decoded: CookieResponse = (await promisify(jwt.verify)(
          token,
          config.get<string>("JWT_SECRET")
        )) as CookieResponse;
        const user = await User.findById(decoded.id);
        if (!user) {
          return next();
        }
        if (user.passwordChangedAfter(decoded.iat)) {
          return next();
        }
        res.locals.user = user;
        return next();
      } catch (error: any) {
        return next();
      }
    }
    return next();
  }
);

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    // httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
