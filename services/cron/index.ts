/**
 * This file contains a CronJob instance that runs a task every minute.
 * It reads queue requests and results from JSON files, processes the requests with a specific query, and writes the results back to the results file.
 * @fileOverview CronJob to process query requests.
 * @module cron-job
 */

import * as fs from "fs";
import { CronJob } from "cron";
import * as dotenv from "dotenv";
import { processQueryRequest } from "../api";
import { bigquery, drive } from "../instance";
import { QUERY, QUERY_LITE } from "../../const";

dotenv.config();

/**
 * Creates a CronJob instance to process query requests.
 */
const job = new CronJob(
  "0 * * * * *",
  async () => {
    console.log("Running a task every minute.");

    const queueRequests: string[] = JSON.parse(
      fs.readFileSync("storage/queue-requests.json", "utf-8")
    );
    let results: { [key: string]: string } = JSON.parse(
      fs.readFileSync("storage/results.json", "utf-8")
    );

    let queueRequestsToWrite = [...queueRequests];

    const current = new Date().getTime().toString();
    for (const i in queueRequests) {
      const target = queueRequests[i];
      if (current >= target) {
        results[target] = await processQueryRequest(
          QUERY_LITE,
          1,
          target,
          bigquery,
          Number(process.env.CALLDATA_SIZE),
          Number(process.env.WRITEDATA_SIZE),
          drive,
          0
        );

        delete queueRequestsToWrite[i];

        fs.writeFileSync("storage/results.json", JSON.stringify(results));
        fs.writeFileSync(
          "storage/queue-requests.json",
          JSON.stringify(queueRequestsToWrite)
        );
      }
    }
  },
  null,
  false,
  "Asia/Tokyo"
);

job.start();
