import express from "express";
import userRouter from "./routes/user.routes";

const app = express();

app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/users", userRouter);

export default app;
