import * as fs from "fs";
import { zip } from "zip-a-folder";
import { config } from "../../const/cfg";
import { fetchAccountInfoRetry } from "../web3";
import { BigQuery } from "@google-cloud/bigquery";
import { query, queryLite } from "../../const/query";
import { GoogleDriveService } from "./gd";

export const fetchData = async (
  filename: string,
  query: string
): Promise<string> => {
  const start = new Date().getTime();
  const bigquery = new BigQuery({
    projectId: "get-eth-positive-accounts",
    keyFilename: "./key/get-eth-positive-accounts-2b71533b34fb.json",
  });

  const [rows] = await bigquery.query(query);
  let length = rows.length;

  console.log({ length });

  if (!fs.existsSync("data")) fs.mkdirSync("data");
  console.log("FILE_NAME", filename);
  const pathName = `data/${filename}`;
  fs.mkdirSync(pathName);

  let chunk: string[];
  let results: any[] = [];
  let batchSize = config.calldataSize;
  for (let i = 0; i < length; ) {
    console.log("Processing batch: ", i);
    chunk = rows.slice(i, (i + batchSize) % length).map((v) => v.address);
    results.push(await fetchAccountInfoRetry(0, chunk, 1));

    i = i + batchSize;
  }

  results = results.flat();
  length = results.length;
  batchSize = config.writeDataSize;
  for (let i = 0; i < length; ) {
    console.log("Processing batch: ", i);
    chunk = results.slice(i, (i + batchSize) % length);
    if (chunk.length == 0) break;
    fs.writeFileSync(
      `${pathName}/${filename}-${i}.csv`,
      "account,balance\n" + chunk.join("\n")
    );
    i = i + batchSize;
  }

  await zip(pathName, `tmp/${filename}.zip`);

  const link = await upload("tmp", `${filename}.zip`);

  console.log(`Execution time: ${new Date().getTime() - start}`);

  return link;
};

const upload = async (path: string, name: string): Promise<string> => {
  const pathName = `${path}/${name}`;

  const googleDriveService = new GoogleDriveService();

  let response = await googleDriveService.saveFile(name, pathName);

  const id = response.data.id;

  response = await googleDriveService.getPublicLink(id);

  const link = response.data.webViewLink;
  console.info("File uploaded successfully!\nLink: ", link);

  return link;
};

fetchData(new Date().getTime().toString(), queryLite)
