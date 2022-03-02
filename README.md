![cloudflare](https://github.com/schachte/JobQueue/actions/workflows/testing.yml/badge.svg)

# Table of Contents

- [Background](#background)
- [Architecture](#architecture)
- [How To Run](#how-to-run)
  - [Install Dependencies & Run](#install-dependencies---run)
  - [Running The Tests](#running-the-tests)
- [Assumptions](#assumptions)
  - [Security](#security)
  - [Concurrency](#concurrency)
- [Questions](#questions)
- [Libraries Used & Why](#libraries-used---why)

# Background

This project is an implementation of the spec written out [here](https://gist.github.com/renandincer/29802d6c84f92ad79bb94ef54fb92444). The intention is to build an in-memory job queue that is controlled over HTTP. For more information, reference the spec listed.

# How To Run

This project assumes you have a working installation of the [NodeJS](https://nodejs.org/en/download/) runtime installed.

## Sample Data

I've created a sample test file for executing test requests against the node server. This is a `postman` collection. You can import the file located in root into Postman. The filename is `JobQueue.postman_collection.json`.

## Install Dependencies & Run

- `npm i` - Installs the required dependencies
- `npm run start` - Starts the HTTP server

## Running The Tests

There is a suite of tests that you can locate in the `tests` directory. In order to run these tests, you can simply run:
`npm run test`

# Assumptions

## Security

1. The underlying assumption when working with this module is that security is _not_ a concern. If this were to be a concern, then implementing a layer of authentication with something like OAuth, JWT or JWKS would allow us to pass tokens into the headers of our requests. There would most likely be a middleware layer present in which all requests would verify the token is both valid and not expired. Leveraging a third-party could also work well here like Okta for enterprise grade authentication/authorization.

2. In addition, there would be some notion of rate limiting to prevent DDOS attacks or system abuse. One could argue this could be handled at the reverse proxy layer using something like HAProxy or NGinx, which I'm assuming wouldn't be relevant to add at this layer of the queue.

## Concurrency

1. This implementation is written in Javascript, a single-threaded language (not considering newer concepts like web workers). As such, I'm assuming that the interactions with the queue and related data structures are more or less accessed synchronously. If race conditions were to be relevant in this problem, then considering some locking mechanism may make sense (ie. blocking queue). I'm assuming that there is only 1 process running such that the queue is centralized to the running process (ie. in-memory queue/singleton). To expand this to some distributed systems architecture, then having a distributed queue or data store would make a lot of sense (Kafka for distributed queue, Redis if we wanted an in-memory cache of job info or even something like DynamoDB for persisting job metadata).

# Questions

1. Do we care at all about the `Type` sent by the producer? From the documentation it states:

> The Type is not considered by the dequeue's business logic.

This statement leads me to believe that we don't need to prioritize data based on how critical it is, which means 1 queue should be fine. If this criteria were to change, then there would be multiple approaches we can prioritize (ie. encoding enum values into a min-heap or separating data into 2 queues).

2. The prompt for the `/jobs/{job_id}` route states:

> There is no need to implement the producers or consumers. You may assume consumers always provide their unique integer Consumer ID in the QUEUE_CONSUMER header for requests they make.

Yet the route itself requires the job_id. Are we saying that we can have duplicate job ids if the consumer ids are different?
The current implementation ensures uniqueness of the job id irrespective of the consumer id

# Things I Didn't Have Time For

1. Validating the payload schema on request
2. Integration testing
3. Metrics

# Libraries Used & Why

- Express (Simplifying API structure, some niceties in this lib that std HTTP lib doesn't offer)
- Pino (Logging)
  - `npm run start` will pipe the log output to pino-pretty for pretty-printed JSON logs
- Nodemon (Hot reloading, easier local development)
- Mocha/Chai (Testing)
