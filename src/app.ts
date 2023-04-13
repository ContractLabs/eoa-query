/**
 * Express server to handle API requests
 * @module expressServer
 */

import express from "express";
import * as dotenv from "dotenv";
import { requestQuery, viewLinks } from "../services/api";

dotenv.config();

const app = express();
const port = process.env.HOST;

// Use JSON middleware
app.use(express.json());

/**
 * Default route to display a greeting message
 *
 * @name GET /
 * @function
 * @memberof module:expressServer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/", (req, res) => {
  res.send("Hello world!");
});

/**
 * API endpoint to submit query request
 *
 * @name POST /api/submit
 * @function
 * @memberof module:expressServer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.body.signature - Signature of the query request
 * @param {string} req.body.message - Query message to submit
 */
app.use("/api/submit", (req, res) => {
  const { signature, message } = req.body;
  requestQuery(message, signature);
  res.sendStatus(200);
});

/**
 * API endpoint to get links associated with an account
 *
 * @name POST /api/get-link
 * @function
 * @memberof module:expressServer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.body.address - Account address to query links for
 * @returns {Object} - Response object containing a success message and queried data
 */
app.use("/api/get-link", (req, res) => {
  const account = req.body.address;
  const data = viewLinks(account);
  console.log(data);
  res.status(200).json({
    message: "Get link successfully!",
    data: data,
  });
});

/**
 * Start listening on the configured port
 *
 * @memberof module:expressServer
 */
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
