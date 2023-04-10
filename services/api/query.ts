import { BigQuery, JobOptions } from "@google-cloud/bigquery";

const bigquery = new BigQuery({
  projectId: "get-eth-positive-accounts",
  keyFilename: "./key/get-eth-positive-accounts-2b71533b34fb.json",
});

const query =
  "SELECT address FROM (SELECT DISTINCT recipient AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Swap` UNION ALL SELECT DISTINCT owner AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Mint` UNION ALL SELECT DISTINCT recipient AS address FROM `blockchain-etl.polygon_quickswap.AlgebraPool_event_Swap` UNION ALL SELECT DISTINCT owner AS address FROM `blockchain-etl.polygon_quickswap.AlgebraPool_event_Mint` UNION ALL SELECT DISTINCT sender AS address FROM `blockchain-etl.ethereum_sushiswap.UniswapV2Pair_event_Swap` UNION ALL SELECT DISTINCT sender AS address FROM `blockchain-etl.ethereum_sushiswap.UniswapV2Pair_event_Mint`) LIMIT 10000000";


bigquery.query(query).then((res) => {
  const [rows] = res;
  console.log("Rows: ");
  rows.forEach((row) => console.log(row));
});
