/**
 * This file provides the configuration and initialization of the BigQuery and Google Drive service.
 * It reads environment variables from the .env file, initializes the BigQuery instance and GoogleDriveService instance.
 */

import * as dotenv from "dotenv";
import { BigQuery } from "@google-cloud/bigquery";
import { GoogleDriveService } from "./util/google-drive-service";

dotenv.config();

/**
 * Initialize a new BigQuery client with the credentials specified in the environment variables.
 */
export const bigquery = new BigQuery({
  projectId: process.env.BIGQUERY_PROJECT_ID,
  keyFilename: process.env.BIGQUERY_KEY_PATH,
});

/**
 * Initialize a new GoogleDriveService client with the credentials specified in the environment variables.
 */
export const drive = new GoogleDriveService(process.env.GD_KEY_PATH || "", [
  "https://www.googleapis.com/auth/drive",
]);