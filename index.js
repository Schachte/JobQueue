// Global Application Configuration
const config = require("./src/config/config");

// Dependency Setup
const express = require("express");
const app = express();
const port = config["http_port"] || process.env.PORT || 3000;

// Middleware
const { middleware: httpLoggingMiddleware } = require("./src/utils/logger");

if (config["enable_http_logging"]) {
  app.use(httpLoggingMiddleware());
}

app.use(express.json());

// Routing
const undefinedRouteHandler = require("./src/middleware/404");
const queueRouter = require("./src/routes/queue.route");

app.use("/jobs", queueRouter);
app.use(undefinedRouteHandler);

app.use(express.urlencoded({ extended: true }));
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
