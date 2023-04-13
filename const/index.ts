/**
 * @title Configuration Constants
 * @notice This file contains various constants used throughout the project
 */

/**
 * @notice Mapping of chain IDs to their respective contract addresses
 */
export const ADDRESS: { [key: number]: string } = {
  1: "0xe2F260951e6F08C46e38Eb749C57Bcffb1D0DAEe",
  97: "0x76a5EC320DB949e46403243d46398100d3EDC5f5",
};

/**
 * @notice Regular expression used to parse date and nonce from signed messages
 */
export const SIGN_MESSAGE_REGEX: RegExp = /Date:\s*(\d+)\nNonce:\s*(\d+)/;

/**
 * @notice SQL query used to retrieve a list of unique addresses from various Ethereum and Polygon pools
 */
export const QUERY =
  "SELECT address FROM (SELECT DISTINCT recipient AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Swap` UNION ALL SELECT DISTINCT owner AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Mint` UNION ALL SELECT DISTINCT recipient AS address FROM `blockchain-etl.polygon_quickswap.AlgebraPool_event_Swap` UNION ALL SELECT DISTINCT owner AS address FROM `blockchain-etl.polygon_quickswap.AlgebraPool_event_Mint` UNION ALL SELECT DISTINCT sender AS address FROM `blockchain-etl.ethereum_sushiswap.UniswapV2Pair_event_Swap` UNION ALL SELECT DISTINCT sender AS address FROM `blockchain-etl.ethereum_sushiswap.UniswapV2Pair_event_Mint`) LIMIT 10000000";

/**
 * @notice SQL query used to retrieve a list of unique recipient addresses from the Ethereum UniswapV3Pool_event_Swap table
 */
export const QUERY_LITE =
  "SELECT DISTINCT recipient AS address FROM `blockchain-etl.ethereum_uniswap.UniswapV3Pool_event_Swap` LIMIT 10000";

/**
 * @notice Mapping of chain IDs to their respective JSON-RPC URLs
 */
export const RPC_URLS: { [key: number]: string[] } = {
  97: [
    "https://bsc-testnet.public.blastapi.io",
    "https://data-seed-prebsc-2-s3.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
    "https://endpoints.omniatech.io/v1/bsc/testnet/public",
  ],
  1: [
    "https://eth.llamarpc.com",
    "https://virginia.rpc.blxrbdn.com",
    "https://singapore.rpc.blxrbdn.com",
    "https://eth.rpc.blxrbdn.com",
    "https://ethereum.publicnode.com",
    "https://uk.rpc.blxrbdn.com",
    "https://rpc.ankr.com/eth",
    "https://rpc.mevblocker.io",
    "https://cloudflare-eth.com",
  ],
};
