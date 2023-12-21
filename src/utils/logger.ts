import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: true,
      levelFirst: true,
    },
  },
});

export default log;
