import { SignatureLike, verifyMessage } from "ethers";
import * as fs from "fs";

export const viewLinks = (account: string): any[] => {
  const requests: { [key: string]: string[] } = JSON.parse(
    fs.readFileSync("db/requests.json", "utf-8")
  );
  const results: string[] = JSON.parse(
    fs.readFileSync("db/results.json", "utf-8")
  );
  
  console.log("ACCOUNT______",account);
  const requestsByAccount = requests[account];
  console.log("REQUEST_BY_ACCOUNT______",requestsByAccount);
  const links = requestsByAccount
    .filter((v) => v in results)
    .map((v) => ({
      name: v,
      link: results[v]
    }));
  console.log("LINK______",links);
  return links;
};

export const requestQuery = (message: string, signature: SignatureLike) => {
  const regex: RegExp = /Date:\s*(\d+)\nNonce:\s*(\d+)/;

  const match: RegExpExecArray | null = regex.exec(message);
  let date: string;
  if (match) date = match[1];
  else throw "error";

  const recoveredAddress = verifyMessage(message, signature);

  let requests: { [key: string]: string[] } = {};
  let queueRequests: string[] = [];

  if (!fs.existsSync("db/requests.json"))
    fs.writeFileSync("db/requests.json", JSON.stringify(requests));
  if (!fs.existsSync("db/queueRequests.json"))
    fs.writeFileSync("db/queue-requests.json", JSON.stringify(queueRequests));

  requests = JSON.parse(fs.readFileSync("db/requests.json", "utf-8"));
  queueRequests = JSON.parse(
    fs.readFileSync("db/queue-requests.json", "utf-8")
  );

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

  fs.writeFileSync("db/requests.json", JSON.stringify(requests));
  fs.writeFileSync("db/queue-requests.json", JSON.stringify(queueRequests));
};
