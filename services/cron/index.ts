import * as fs from "fs";
import { CronJob } from "node-cron";
import { fetchData } from "../api/query";
import { query } from "../../const/query";

const job = new CronJob("0 * * * * *", async () => {
  console.log("Running a task every minute.");

  const requests = JSON.parse(fs.readFileSync("request.json", "utf-8"));

  const current = new Date().getTime();
  for (const i in requests) {
    const target = Date.parse(requests[i]);
    await fetchData(target.toString(), query);
  }
});

job.start();
