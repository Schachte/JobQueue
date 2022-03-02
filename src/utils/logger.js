const pino = require("pino");
const expressPino = require("express-pino-logger");

const logger = () => pino({ level: process.env.LOG_LEVEL || "info" });

// Middleware to enable HTTP logging for each request (optional)
const middleware = () => expressPino({ pinoLogger: logger() });

module.exports = {
  logger: logger(),
  middleware,
};
