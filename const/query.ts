export const query =
  "SELECT address FROM (SELECT DISTINCT recipient AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Swap` UNION ALL SELECT DISTINCT owner AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Mint` UNION ALL SELECT DISTINCT recipient AS address FROM `blockchain-etl.polygon_quickswap.AlgebraPool_event_Swap` UNION ALL SELECT DISTINCT owner AS address FROM `blockchain-etl.polygon_quickswap.AlgebraPool_event_Mint` UNION ALL SELECT DISTINCT sender AS address FROM `blockchain-etl.ethereum_sushiswap.UniswapV2Pair_event_Swap` UNION ALL SELECT DISTINCT sender AS address FROM `blockchain-etl.ethereum_sushiswap.UniswapV2Pair_event_Mint`) LIMIT 10000000";

export const queryLite =
  "SELECT DISTINCT recipient AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Swap` LIMIT 10000000";
