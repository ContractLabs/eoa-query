import * as fs from "fs";
import { CronJob } from "cron";
import { fetchData } from "../api/query";
import { query, queryLite } from "../../const/query";


const job = new CronJob("0 * * * * *", async () => {
  console.log("Running a task every minute.");

  let queueRequests: string[] = JSON.parse(fs.readFileSync("db/queue-requests.json", "utf-8"));
  let results: { [key: string]: string } = {};
  
  if (!fs.existsSync("db/results.json"))
    fs.writeFileSync("db/results.json", JSON.stringify(results));
  else results = JSON.parse(fs.readFileSync("db/results.json", "utf-8"))

  let queueRequestsToWrite = [...queueRequests];

  const current = new Date().getTime().toString();
  console.log(current);
  for (const i in queueRequests) {
    const target = queueRequests[i];
    console.log(typeof target);
    console.log(current > target);
    if (current >= target) {
      const link = await fetchData(target, queryLite);
      console.log(link);
      results[target] = link;

      delete queueRequestsToWrite[i];

      fs.writeFileSync("db/results.json", JSON.stringify(results));
      fs.writeFileSync(
        "db/queue-requests.json",
        JSON.stringify(queueRequestsToWrite)
      );
    }
  };
}, null, false, "Asia/Tokyo");
job.start();
