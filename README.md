<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">EOA QUERY</h3>

  <p align="center">
    Query "n" address have the highest ETH balance on DEX exchanges like sushiswap, uniswap and filter to get only EOA address
    <br />
    <a href="https://eoa-query.w3w.app/">View Demo</a>
    ·
    <a href="https://github.com/ContractLabs/eoa-query/issues">Report Bug</a>
    ·
    <a href="https://github.com/ContractLabs/eoa-query/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#set-up-authentication">Set up authentication</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Set an appointment date, come to an appointment to get the link of the csv file that has queried "n" for eoa wallet with the highest eth balance on DEXs (sushiswap, uniswap).


### Built With

* [![TypeScript][TypeScript.ts]][TypeScript-url]
* [![React][React.js]][React-url]
* ![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
* yarn 
  ```sh
  npm install --global yarn
  ```

### Set up authentication

Instructions for creating an Oauth Client Key on Google Cloud:

1. Go to https://console.cloud.google.com/welcome
2. On the right-hand toolbar (3 dashes), hover on "Pinned (API & Services)"
3. Click on "Credentials"
4. Click on "Create a Project" (top right-hand side)
5. Name the project and click "Create project"
6. Click on "Create Credentials" (top left-hand side)
7. Select "Service Account"
8. Fill in the information and click "Save & continue"
9. Select "Owner" role
10. Click "Done"
11. On the Service Account's Action dashboard (top right corner), click on the pencil icon
12. Select the "Keys" tab
13. Click "Add key" -> "Create new key" -> "JSON" (Key pair is generated and downloaded to your machine as a new file)
14. Go back to the API & Services Dashboard, select "Enabled APIs & Services"
15. Click "Enable APIs & Services"
16. Search for "Drive"
17. Click on "Google Drive API"
18. Click "Enable"


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ContractLabs/eoa-query.git
   ```
2. Copy the key file to a new folder named 'key' in the following path: [eoa-query/key](http://github.com/ContractLabs/eoa-query/blob/main/key)
3. Install packages
   ```sh
   npm install 
   ```
   or
   ```sh
   yarn
   ```
4. Change config limit, DEX exchange of query in the following path: [eoa-query/const/index.ts](https://github.com/ContractLabs/eoa-query/blob/main/const/index.ts)
   ```ts
   const QUERY = 'SELECT DISTINCT recipient AS address FROM `{keep the same if you want to query at 3 dex exchanges sushiswap, quickswap, uniswap or you can delete some unnecessary dex exchange}` LIMIT {your limit number}';
   ```
5. Config: 
   <br/>
   CALLDATA_SIZE, WRITEDATA_SIZE (example: 5000 ~ 5000 line of data/csv file)
   <br/>
   BIGQUERY_PROJECT_ID is the id of the project created in step 5 in [here](https://github.com/ContractLabs/eoa-query/edit/main/README.md#set-up-authentication)
   <br/>
   BIGQUERY_KEY_PATH is the path to file key in [eoa-query/key](http://github.com/ContractLabs/eoa-query/blob/main/key)
<!-- USAGE EXAMPLES -->
## Usage

1. If you don't need UI, doing the following step: (**Recommended***)
   <br/>
   Step 1: Install ts-node in global
   <br/>
   Step 2: Create file index.ts in eoa-query/services
    ```sh
    import { processQueryRequest } from "./api";
    import { bigquery, drive } from "./instance";
    import { QUERY, QUERY_LITE } from "../const";

    async function queryWithoutUI() {
        const results = await processQueryRequest(
            QUERY,
            1,
            "query-without-ui", // file name 
            bigquery,
            Number(process.env.CALLDATA_SIZE),
            Number(process.env.WRITEDATA_SIZE),
            drive,
            0
        );
    }
    queryWithoutUI();
    ```
    Step 3: In Terminal run this script:
    ```sh
    ts-node ./services/index.ts
    ```
    Step 4: In eoa-query/data/query-without-ui are the data csv files

2. If you need UI, doing the following step: 
   <br/>
   Step 1: Clone this repo
   ```sh
   https://github.com/ContractLabs/eoa-query-ui.git
   ```
   Step 2: then install UI packages
   ```sh
   yarn
   ```
   Step 3: run react
   ```sh
   yarn start
   ```
   Step 4: run server 
   ```sh
   yarn start
   ```
   open new terminal tab:
   ```sh
   yarn cronjob
   ```
   Step 5: Connect wallet on UI, pick a date, submit & sign message
   <br/>
   Step 6: Get link and download the data file in drive link



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ContractLabs/eoa-query.svg?style=for-the-badge
[contributors-url]: https://github.com/ContractLabs/eoa-query/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ContractLabs/eoa-query.svg?style=for-the-badge
[forks-url]: https://github.com/ContractLabs/eoa-query/network/members
[stars-shield]: https://img.shields.io/github/stars/ContractLabs/eoa-query.svg?style=for-the-badge
[stars-url]: https://github.com/ContractLabs/eoa-query/stargazers
[issues-shield]: https://img.shields.io/github/issues/ContractLabs/eoa-query.svg?style=for-the-badge
[issues-url]: https://github.com/ContractLabs/eoa-query/issues
[license-shield]: https://img.shields.io/github/license/ContractLabs/eoa-query.svg?style=for-the-badge
[license-url]: https://github.com/ContractLabs/eoa-query/blob/master/LICENSE.txt
[TypeScript.ts]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[TypeScript-url]: https://www.typescriptlang.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
