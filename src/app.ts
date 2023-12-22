import express, { RequestHandler } from "express";
import userRouter from "./routes/user.routes";
import { protect } from "./utils/deserializeUser";

const app = express();

app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// app.use(protect as RequestHandler);
app.use("/api/v1/users", userRouter);

export default app;
