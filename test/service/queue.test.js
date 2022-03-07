// const assert = require("chai").assert;

// const {
//   enqueue,
//   dequeue,
//   conclude,
//   information,
//   wipeJobQueueData,
// } = require("../../src/service/queue");

// describe("Queue Service Layer Implementation", () => {
//   describe("Enqueue Route Handling", () => {
//     it("Sending a request with an empty body fails", () => {
//       const request = { body: null };

//       // Psuedo mock
//       const response = {
//         status: (code) => {
//           response["resultStatus"] = code;
//           return response;
//         },
//         send: (e) => {
//           response["resultError"] = e;
//           return response;
//         },
//       };

//       enqueue(request, response);

//       assert.equal(response["resultStatus"], 500);
//       assert.equal(
//         response["resultError"].error,
//         "Input request is null or empty"
//       );
//     });

//     it("Sending a request with valid job payload enqueues the job", () => {
//       const request = {
//         body: {
//           ID: 1,
//           Type: "TIME_CRITICAL",
//         },
//       };

//       // Psuedo mock
//       const response = {
//         status: (code) => {
//           response["resultStatus"] = code;
//           return response;
//         },
//         send: (e) => {
//           response["result"] = e;
//           return response;
//         },
//       };

//       enqueue(request, response);
//       assert.equal(response["resultStatus"], 200);
//       assert.equal(response["result"].jobId, 1);
//     });
//   });

//   describe("Dequeue Route Handling", () => {
//     beforeEach(() => {
//       wipeJobQueueData();
//     });

//     it("Dequeue the job queue that is empty causes failure", () => {
//       // Psuedo mock
//       const response = {
//         status: (code) => {
//           response["resultStatus"] = code;
//           return response;
//         },
//         send: (e) => {
//           response["resultError"] = e;
//           return response;
//         },
//       };

//       data = dequeue(null, response);

//       assert.equal(response["resultStatus"], 500);
//       assert.equal(
//         response["resultError"].error,
//         "The queue is currently empty - there is nothing to dequeue."
//       );
//     });

//     it("Properly dequeues the record that was added with the lowest timestamp (FIFO)", () => {
//       const request = {
//         body: {
//           ID: 1,
//           Type: "TIME_CRITICAL",
//         },
//       };

//       // Psuedo mock
//       const response = {
//         status: (code) => {
//           response["resultStatus"] = code;
//           return response;
//         },
//         send: (e) => {
//           response["result"] = e;
//           return response;
//         },
//       };

//       enqueue(request, response);
//       dequeue(null, response);

//       assert.equal(response["result"].ID, 1);
//       assert.equal(response["result"].Type, "TIME_CRITICAL");
//       assert.equal(response["result"].Status, "IN_PROGRESS");
//       assert.equal(response["resultStatus"], 200);
//     });
//   });
// });
