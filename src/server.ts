import mongoose from "mongoose";
import log from "./utils/logger";
import app from "./app";
import config from "config";

process.on("uncaughtException", (err) => {
  log.error("UNHANDLED EXCEPTION! Shutting down...");
  log.error(err.name, err.message);
  process.exit(1);
});

const database_url = config
  .get<string>("DATABASE_CONNECTION_URL")
  .replace("<username>", config.get<string>("DATABASE_USERNAME"))
  .replace("<password>", config.get<string>("DATABASE_PASSWORD"));

mongoose
  .connect(database_url)
  .then(() => {
    log.info("Database connected");
  })
  .catch((err: any) => {
    log.error(err);
  });

const server = app.listen(config.get<number>("port"), () => {
  log.info(`Server started at port ${config.get<number>("port")}`);
});

process.on("unhandledRejection", (err: any) => {
  log.error("UNHANDLED REJECTION! Shutting down...");
  log.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
