const JobQueue = require("../utils/JobQueue");
const { logger } = require("../utils/logger");
const { IN_PROGRESS, CONCLUDED } = require("../utils/constants");

const jobQueue = new JobQueue();

const inProgessJobs = {};
const concludedJobs = {};

/**
 * Handles queueing jobs if there is no duplicate job already on the queue.
 *
 * @note See question in README.md - Uniqueness is guaranteed irrespective of consumer ID. Do we want to change that?
 * @throws Will throw an error if the job id already exists on the queue
 * @throws Will throw an error if the job is missing from the request

 * @returns The ID of the job 
 */
const enqueue = (req, res) => {
  try {
    const { body: job } = req;
    if (job == null) throw "Input request is null or empty";
    if (!Object.keys(job).length) throw "Request is missing a job to enqueue.";
    const jobId = jobQueue.enqueue(job);
    res.status(200).send({ jobId });
  } catch (e) {
    logger.error(e);
    res.status(500).send({ error: e });
  }
};

/**
 * Handles dequeuing jobs that have not been previously dequeued or concluded
 *
 * @note See question in README.md - Dequeue doesn't account for "criticality" of the jobs, only FIFO. We can change this with
 *       a tiered linkedlist or min-heap.
 * @throws Will throw an error if there are no more items in the queue to process
 *
 * @return Returns a job from the queue Jobs are considered available for Dequeue if the job has not been concluded and has not dequeued already
 */
const dequeue = (_, res) => {
  try {
    const job = jobQueue.dequeue();
    inProgessJobs[job.ID] = { ...job, Status: IN_PROGRESS };
    res.status(200).send(inProgessJobs[job.ID]);
  } catch (e) {
    logger.error(e);
    res.status(500).send({ error: e });
  }
};

/**
 * Allows a client to complete a job that was IN_PROGRESS assuming it was IN_PROGRESS
 *
 * @throws Will throw an error if there was no job in progress with the requested jobId
 *
 * @returns Success message to tell the client that the requested job was completed
 */
const conclude = (req, res) => {
  const { jobId } = req.params;

  try {
    if (!inProgessJobs.hasOwnProperty(jobId))
      throw `The requested job ID: ${jobId} is not currently in-progress.`;
    concludedJobs[jobId] = { ...inProgessJobs[jobId], Status: CONCLUDED };
    delete inProgessJobs[jobId];
    res.status(200).send(concludedJobs[jobId]);
  } catch (e) {
    logger.error(e);
    res.status(500).send({ error: e });
  }
};

/**
 * Enables job information retrieval given a jobId
 * Since we cache jobs in a map, retrieval is constant and does not require linear traversal through the queue
 *
 * @throws Will throw an error if there are no jobs found with the requested jobId
 *
 * @returns the requested job corresponding to the user-requested jobId
 */
const information = (req, res) => {
  const { jobId } = req.params;
  const sendResult = (payload) => res.status(200).send(payload);

  try {
    const requestedJob = [
      jobQueue.retrieve(jobId),
      inProgessJobs[jobId],
      concludedJobs[jobId],
    ].filter((item) => item != null);

    if (requestedJob.length == 0) {
      const err = `The job ${jobId} was not found within our queue of existing or completed jobs.`;
      logger.error(err);
      throw err;
    }

    logger.info(`Information retrieved for job id: ${jobId}`);
    sendResult(requestedJob[0]);
  } catch (e) {
    logger.error(e);
    res.status(500).send({ error: e });
  }
};

// Used for tests - can be avoided if we favor a more compositional approach (to-do)
const wipeJobQueueData = () => {
  jobQueue.wipeQueue();
  for (var key in inProgessJobs) {
    delete inProgessJobs[key];
  }
  for (var key in concludedJobs) {
    delete concludedJobs[key];
  }
};

module.exports = {
  enqueue,
  dequeue,
  conclude,
  information,
  wipeJobQueueData,
};
