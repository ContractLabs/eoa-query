import * as fs from "fs";
import { CronJob } from "node-cron";
import { fetchData } from "../api/query";
import { query, queryLite } from "../../const/query";

const job = new CronJob("0 * * * * *", async () => {
  console.log("Running a task every minute.");

  let requests: { [key: string]: string[] } = {};
  let queueRequests: string[] = [];
  let results: { [key: string]: string } = {};

  if (!fs.existsSync("db/requests.json"))
    fs.writeFileSync("db/requests.json", JSON.stringify(requests));
  if (!fs.existsSync("db/queueRequests.json"))
    fs.writeFileSync("db/queue-requests.json", JSON.stringify(queueRequests));
  if (!fs.existsSync("db/results.json"))
    fs.writeFileSync("db/results.json", JSON.stringify(results));

  let requestsToWrite = { ...requests };
  let queueRequestsToWrite = [...queueRequests];

  const current = new Date().getTime();
  for (const i in queueRequestsToWrite) {
    const target = queueRequestsToWrite[i];
    if (current >= Number(target)) {
      const link = await fetchData(target.toString(), query);
      let results = JSON.parse(fs.readFileSync("db/results.json", "utf-8"));

      results[target] = link;

      delete requestsToWrite[i];

      fs.writeFileSync("db/results.json", JSON.stringify(results));
      fs.writeFileSync(
        "db/queue-requests.json",
        JSON.stringify(queueRequestsToWrite)
      );
    }
  }
});

job.start();
