/**
 * @title QueryProcessor
 * @notice This fie contains functions to process query requests, get download links for files, view links, and request queries.
 * @dev It depends on the following external libraries and modules:
 *   - fs: built-in Node.js module for file system operations.
 *   - zip-a-folder: library for zipping a folder in Node.js.
 *   - web3: module for Ethereum interaction.
 *   - @google-cloud/bigquery: module for Google BigQuery interaction.
 *   - ethers: library for Ethereum interaction.
 *   - google-drive-service: module for Google Drive API interaction.
 */
import * as fs from "fs";
import { zip } from "zip-a-folder";
import { fetchAccountInfoRetry } from "../web3";
import { BigQuery } from "@google-cloud/bigquery";
import { SignatureLike, verifyMessage } from "ethers";
import { SIGN_MESSAGE_REGEX } from "../../const";
import { GoogleDriveService } from "../util/google-drive-service";

/**
 * @notice This function processes a query request.
 * @param query The BigQuery SQL query string.
 * @param chainId The Ethereum chain ID.
 * @param filename The name of the CSV file.
 * @param bigquery The BigQuery object.
 * @param drive The GoogleDriveService object.
 * @param balanceFilterThreshold The balance filter threshold.
 * @return The download link for the zipped CSV file.
 */
export const processQueryRequest = async (
  query: string,
  chainId: number,
  filename: string,
  bigquery: BigQuery,
  calldataSize: number,
  writeDataSize: number,
  drive: GoogleDriveService,
  balanceFilterThreshold: number
): Promise<string> => {
  const [records] = await bigquery.query(query);

  // Create a new directory for the CSV files
  const pathName = `data/${filename}`;
  fs.mkdirSync(pathName);

  let chunk: string[];
  let results: any[] = [];
  let length = records.length;
  console.log({ length });

  // Fetch account information for each batch of addresses in the query results
  for (let i: number = 0; i < length; i += calldataSize) {
    chunk = records.slice(i, i + calldataSize).map((v) => v.address);
    results.push(
      ...(await fetchAccountInfoRetry(balanceFilterThreshold, chunk, chainId))
    );
  }

  length = results.length;

  console.log({ length });

  // Write the account information to CSV files
  for (let i: number = 0; i < length; i += writeDataSize) {
    chunk = results.slice(i, i + writeDataSize);
    fs.writeFileSync(
      `${pathName}/${filename}-${i}.csv`,
      "account,balance\n" + chunk.join("\n")
    );
  }

  // Zip the CSV files
  await zip(pathName, `tmp/${filename}.zip`);

  // Get the download link for the zipped CSV file
  return await getGDDownloadLink(drive, "tmp", `${filename}.zip`);
};

/**
 * @notice This function gets the download link for a file in Google Drive.
 * @param drive The GoogleDriveService object.
 * @param path The path to the file.
 * @param name The name of the file.
 * @return The download link for the file.
 */
const getGDDownloadLink = async (
  drive: GoogleDriveService,
  path: string,
  name: string
): Promise<string> => {
  const response = await drive.getPublicLink(
    (
      await drive.saveFile(name, `${path}/${name}`)
    ).data.id
  );

  return response.data.webViewLink;
};

export const viewLinks = (account: string): any[] => {
  const requests: { [key: string]: string[] } = JSON.parse(
    fs.readFileSync("storage/requests.json", "utf-8")
  );
  const results: string[] = JSON.parse(
    fs.readFileSync("storage/results.json", "utf-8")
  );

  const requestsByAccount = requests[account];
  const links = requestsByAccount
    .filter((v) => v in results)
    .map((v) => ({
      name: v,
      link: results[v],
    }));
  return links;
};

export const requestQuery = (message: string, signature: SignatureLike) => {
  const match: RegExpExecArray | null = SIGN_MESSAGE_REGEX.exec(message);
  let date: string;
  if (match) date = match[1];
  else throw "error";

  let requests: { [key: string]: string[] } = JSON.parse(
    fs.readFileSync("storage/requests.json", "utf-8")
  );
  let queueRequests: string[] = JSON.parse(
    fs.readFileSync("storage/queue-requests.json", "utf-8")
  );

  const recoveredAddress: string = verifyMessage(message, signature);
  if (recoveredAddress in requests) {
    requests[recoveredAddress].push(date);
    requests[recoveredAddress] = requests[recoveredAddress].filter(
      (value, index, self) => self.indexOf(value) === index
    );
  } else requests[recoveredAddress] = [date];

  queueRequests.push(date);
  queueRequests = queueRequests.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  fs.writeFileSync("storage/requests.json", JSON.stringify(requests));
  fs.writeFileSync(
    "storage/queue-requests.json",
    JSON.stringify(queueRequests)
  );
};
