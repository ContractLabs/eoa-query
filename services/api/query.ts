import * as fs from "fs";
import JSZip from "jszip";
import { config } from "../../const/cfg";
import { fetchAccountInfoRetry } from "../web3";
import { BigQuery } from "@google-cloud/bigquery";
import { query, queryLite } from "../../const/query";

export const fetchData = async (filename: string, query: string) => {
  const start = new Date().getTime();
  const bigquery = new BigQuery({
    projectId: "get-eth-positive-accounts",
    keyFilename: "./key/get-eth-positive-accounts-2b71533b34fb.json",
  });

  const [rows] = await bigquery.query(query);
  let length = rows.length;

  console.log({ length });

  if (!fs.existsSync("data")) fs.mkdirSync("data");
  const pathName = `data/${filename}`;
  fs.mkdirSync(pathName);

  let chunk: string[];
  let results: any[] = [];
  let batchSize = config.calldataSize;
  for (let i = 0; i < length; ) {
    chunk = rows.slice(i, (i + batchSize) % length).map((v) => v.address);
    results.push(await fetchAccountInfoRetry(0, chunk, 97));

    i += batchSize;
  }

  length = results.length;
  batchSize = config.writeDataSize;
  for (let i = 0; i < length; ) {
    chunk = results.slice(i, (i + batchSize) % length);
    fs.writeFileSync(
      `${pathName}/${filename}-${i}.csv`,
      "account,balance\n" + chunk.join("\n")
    );
    i += batchSize;
  }

  const zip = new JSZip();
  const files = fs.readdirSync(pathName);
  const folder = zip.folder(pathName);
  for (const file of files) {
    const content = fs.readFileSync(`${pathName}/${file}`);
    folder?.file(file, content);
  }

  await zip.generateAsync({ type: "blob" });

  console.log(`Execution time: ${new Date().getTime() - start}`);
};

fetchData(new Date().getTime().toString(), queryLite).then(() => {});
