import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/user.routes";
import placeRouter from "./routes/place.routes";
import reviewRouter from "./routes/review.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(req.cookies);
//   next();
// });

// app.use(protect as RequestHandler);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/places", placeRouter);
app.use("/api/v1/reviews", reviewRouter);

export default app;
