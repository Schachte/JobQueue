/**
 * Give more dynamic control to the user for how they want to run the application
 *
 * CONFIGURATION
 * -------------
 * enable_http_logging - Enables HTTP request logging on a per-request basic (express middleware)
 * http_port - Override the default port that the HTTP server is running on
 */
module.exports = {
  enable_http_logging: process.env.ENABLE_HTTP_LOGGING || false,
  http_port: process.env.NODE_PORT || 3000,
  max_enqueue_size: 10,
};
