let { logger } = require("../utils/logger");

/**
 * Handles clients who access undefined routes
 *
 * @param req - HTTP request from client
 * @param res - Response to send back to the user
 */
module.exports = (req, res) => {
  const { url } = req;
  logger.error(`User has requested an unknown route: ${url}`);

  res.status(404).send({
    code: "404",
    description: "Resource Not Found",
    message: `The requested route ${url} was not found`,
  });
};
