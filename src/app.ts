import express from "express";
import userRouter from "./routes/user.routes";
import placeRouter from "./routes/place.routes";

import cors from "cors";

const app = express();
app.use(cors());
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// app.use(protect as RequestHandler);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/places", placeRouter);

export default app;
