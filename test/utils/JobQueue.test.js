const expect = require("chai").expect;
const assert = require("chai").assert;

const JobQueue = require("../../src/utils/JobQueue");

const sampleJobs = [
  {
    ID: 1,
    Type: "TIME_CRITICAL",
  },
  {
    ID: 2,
    Type: "NOT_TIME_CRITICAL",
  },
  {
    ID: 3,
    Type: "NOT_TIME_CRITICAL",
  },
  {
    ID: 4,
    Type: "TIME_CRITICAL",
  },
];

describe("JobQueue Implementation", () => {
//   describe("Enqueue Functionality", () => {
//     let queue;
//     beforeEach(() => {
//       queue = new JobQueue();
//     });

//     it("Enqueueing a new job succeeds and returns the job id", () => {
//       const result = queue.enqueue(sampleJobs[1]);
//       assert.equal(result, 2);
//     });

//     it("Enqueueing a duplicate job fails with duplicate job error", () => {
//       queue.enqueue(sampleJobs[0]);
//       expect(() => queue.enqueue(sampleJobs[0])).to.throw(
//         "This job ID has already been queued - Job: 1"
//       );
//     });

//     it("Exceeding the max enqueue threshold causes enqueue failure", () => {
//       queue.setMaxQueueSize(2);

//       queue.enqueue(sampleJobs[0]);
//       queue.enqueue(sampleJobs[1]);
//       expect(() => queue.enqueue(sampleJobs[2])).to.throw(
//         "The number of queued items has exceeded the threshold of 2"
//       );
//     });
//   });

//   describe("Dequeue Functionality", () => {
//     let queue;
//     beforeEach(() => {
//       queue = new JobQueue();
//     });

//     it("Dequeuing an empty queue throws empty queue error", () => {
//       expect(() => queue.dequeue()).to.throw(
//         "The queue is currently empty - there is nothing to dequeue."
//       );
//     });

//     it("Dequeuing a populated queue retrieves the latest item based on FIFO ordering", () => {
//       queue.enqueue(sampleJobs[0]);
//       queue.enqueue(sampleJobs[1]);
//       queue.enqueue(sampleJobs[2]);

//       // Dequeue will mutate the Status field to IN_PROGRESS, so I just assert the object equality as if that rewrite hasn't happened yet
//       const job1 = queue.dequeue();
//       const job2 = queue.dequeue();
//       const job3 = queue.dequeue();

//       expect(job1).to.deep.equal({ ...sampleJobs[0], Status: "QUEUED" });
//       expect(job2).to.deep.equal({ ...sampleJobs[1], Status: "QUEUED" });
//       expect(job3).to.deep.equal({ ...sampleJobs[2], Status: "QUEUED" });
//     });
//   });

//   describe("Job Retrieval Functionality", () => {
//     let queue;
//     beforeEach(() => {
//       queue = new JobQueue();
//     });

//     it("Returns null if attempt to retrieve non-existent job", () => {
//       assert.isNull(queue.retrieve("THIS_JOB_TOTALLY_DOESNT_EXIST"));
//     });

//     it("Returns different queued jobs", () => {
//       queue.enqueue(sampleJobs[0]);
//       queue.enqueue(sampleJobs[1]);
//       queue.enqueue(sampleJobs[2]);
//       queue.enqueue(sampleJobs[3]);

//       assert.isNotNull(queue.retrieve("1"));
//       assert.isNotNull(queue.retrieve("2"));
//       assert.isNotNull(queue.retrieve("3"));
//       assert.isNotNull(queue.retrieve("4"));
//     });
//   });

//   describe("Empty Queue Checks", () => {
//     let queue;
//     beforeEach(() => {
//       queue = new JobQueue();
//     });

//     it("Returns true if the queue is empty", () => {
//       const isEmpty = queue.isEmpty();
//       expect(isEmpty).to.be.true;
//     });

//     it("Returns false if the queue is populated", () => {
//       queue.enqueue(sampleJobs[0]);
//       const isEmpty = queue.isEmpty();
//       expect(isEmpty).to.be.false;
//     });
//   });

  describe("Validating Queue Priority Handling", () => {
    let queue;
    beforeEach(() => {
      queue = new JobQueue();
    });

    it("Prioritizing a mixture of low and high priority values dequeues in the right order", () => {
      const job1 = queue.enqueue(sampleJobs[0])
      const job2 = queue.enqueue(sampleJobs[1])
      const job3 = queue.enqueue(sampleJobs[2])
      const job4 = queue.enqueue(sampleJobs[3])

      const job1D = queue.dequeue()
      const job2D = queue.dequeue()
      const job3D = queue.dequeue()
      const job4D = queue.dequeue()

      assert.equal(job1, 1);
      assert.equal(job2, 2);
      assert.equal(job3, 3);
      assert.equal(job4, 4);

      assert.equal(job1D.ID, 1);
      assert.equal(job2D.ID, 4);
      assert.equal(job3D.ID, 2);
      assert.equal(job4D.ID, 3);
    });
  });
});
