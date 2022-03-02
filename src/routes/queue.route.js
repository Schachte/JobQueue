const express = require("express");
const router = express.Router();
const {
  enqueue,
  dequeue,
  conclude,
  information,
} = require("../service/queue.js");

// REST API Route Definitions
const routes = {
  POST: {
    enqueue,
    dequeue,
  },
  PUT: {
    ":jobId/conclude": conclude,
  },
  GET: {
    ":jobId": information,
  },
};

Object.entries(routes.GET).forEach((route) =>
  router.get(`/${route[0]}`, route[1])
);

Object.entries(routes.POST).forEach((route) => {
  router.post(`/${route[0]}`, route[1]);
});

Object.entries(routes.PUT).forEach((route) =>
  router.put(`/${route[0]}`, route[1])
);

module.exports = router;
