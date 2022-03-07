const config = require("../config/config");
const { logger } = require("./logger");
const { QUEUED, NOT_TIME_CRITICAL, TIME_CRITICAL } = require("./constants");

/**
 * Simple Queue Implementation
 */
class JobQueue {
  constructor() {
    const DEFAULT_MAX_QUEUE_SIZE = 20;

    // Limit number of concurrent jobs queued to reduce memory overload
    this.maxQueueSize = config["max_enqueue_size"] || DEFAULT_MAX_QUEUE_SIZE;

    // Enable constant time access for searching for specific jobs
    this.queueMetadata = {};

    // Facilitates FIFO retrieval
    this.queue = [];

    this.lowPriorityQueue = [];
    this.highPriorityQueue = [];
  }

  enqueue(job) {
    const { ID: jobId, Type: priority } = job;
    const queueSize = `${this.queue.length}/${this.maxQueueSize} items currently in the queue`;

    if (jobId in this.queueMetadata) {
      logger.error(`Unable to queue a job that already exists - ID: ${jobId}`);
      throw `This job ID has already been queued - Job: ${jobId}`;
    }

    if (this.lowPriorityQueue.length + this.highPriorityQueue.length >= this.maxQueueSize) {
      logger.error(queueSize);
      throw `The number of queued items has exceeded the threshold of ${this.maxQueueSize}`;
    }

    logger.info(queueSize);

    const queuedJob = { ...job, Status: QUEUED };
    if (priority == NOT_TIME_CRITICAL) {
      this.lowPriorityQueue.push(queuedJob);
      this.queueMetadata[jobId] = queuedJob;
    } else if (priority == TIME_CRITICAL) {
      this.highPriorityQueue.push(queuedJob);
      this.queueMetadata[jobId] = queuedJob;
    }

    logger.info(`${jobId} has been added successfully`);
    return jobId;
  }

  dequeue() {
    if (this.highPriorityQueue.length != 0) {
      const dequeuedjob = this.highPriorityQueue.shift();
      delete this.queueMetadata[dequeuedjob.id];
      logger.info(
        `${this.queue.length}/${this.maxqueuesize} items currently in the queue`
      );
      return dequeuedjob;
    }

    if (this.lowPriorityQueue.length != 0) {
      const dequeuedjob = this.lowPriorityQueue.shift();
      delete this.queueMetadata[dequeuedjob.id];
      logger.info(
        `${this.queue.length}/${this.maxqueuesize} items currently in the queue`
      );
      return dequeuedjob;
    }

    logger.error("Unable to deqeue an empty queue.");
    throw "The queue is currently empty - there is nothing to dequeue.";
  }

  retrieve(jobId) {
    if (jobId in this.queueMetadata) {
      logger.info(`${jobId} has been retrieved`);
      return this.queueMetadata[jobId];
    }

    logger.error(`Unable to find requested job with id of: ${jobId}`);
    return null;
  }

  cancel(jobId) {
    if (jobId in this.queueMetadata) {
      const job = this.queueMetadata[jobId]

      if (job.Type == TIME_CRITICAL) {
        this.highPriorityQueue = this.highPriorityQueue.filter(item => item.ID != jobId)
      }

      if (job.Type == NOT_TIME_CRITICAL) {
        this.lowPriorityQueue = lowPriorityQueue.filter(item => item.ID != jobId)
      }

      return jobId
    }

    logger.error(`Unable to find requested job with id of: ${jobId}`);
    return null;
  }

  isEmpty() {
    return this.queue.length == 0;
  }

  setMaxQueueSize(size) {
    this.maxQueueSize = size;
  }

  wipeQueue() {
    this.queue = [];
    this.queueMetadata = {};
  }
}

module.exports = JobQueue;
