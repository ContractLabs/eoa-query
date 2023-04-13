/**
 * @title EthereumAccountInfo
 * @dev A library that provides functionality to fetch and view Ethereum account information.
 */
import {
  Contract,
  formatEther,
  verifyMessage,
  SignatureLike,
  JsonRpcProvider,
} from "ethers";
import { RPC_URLS, ADDRESS } from "../../const";
import { AddressFilter, AddressFilter__factory } from "../../typechain-types";

/**
 * @dev Recovers the signer of a message from the provided signature.
 * @param message The message that was signed.
 * @param signature The signature to recover the signer from.
 * @returns The address of the signer.
 */
export const recoverSigner = (message: string, signature: SignatureLike) =>
  verifyMessage(message, signature);

/**
 * @dev Gets a random RPC URL for the specified chain ID.
 * @param chainId The ID of the chain to get an RPC URL for.
 * @returns The URL of the RPC endpoint.
 */
const getRpcUrl = (chainId: number): string =>
  RPC_URLS[chainId][Math.floor(Math.random() * RPC_URLS[chainId].length)];

/**
 * @dev Gets a provider instance for the specified chain ID.
 * @param chainId The ID of the chain to get a provider for.
 * @returns The provider instance.
 */
const getProvider = (chainId: number): JsonRpcProvider =>
  new JsonRpcProvider(getRpcUrl(chainId));

/**
 * @dev Gets an instance of the address filter contract for the specified chain ID.
 * @param chainId The ID of the chain to get the address filter contract for.
 * @returns The address filter contract instance.
 */
const getAddressFilter = (chainId: number) =>
  new Contract(ADDRESS[chainId], AddressFilter__factory.abi).connect(
    getProvider(chainId)
  ) as AddressFilter;

/**
 * @dev Views the information of the specified addresses from the address filter contract.
 * @param balanceFilterThreshold The minimum balance threshold to filter addresses by.
 * @param addresses The addresses to view information for.
 * @param addressFilter The address filter contract instance.
 * @returns An array of strings representing the account information for each address.
 */
export const viewAddressInfo = async (
  balanceFilterThreshold: number,
  addresses: string[],
  addressFilter: AddressFilter
): Promise<string[]> => {
  const returnData = await addressFilter.viewAddressInfo.staticCall(addresses);
  const one = BigInt(1);
  return addresses
    .map((address, i) => ({ account: address, balance: returnData[i] >> one }))
    .filter((v) => v.balance > balanceFilterThreshold)
    .map((v) => `'${v.account}',${formatEther(v.balance)} ETH`);
};

/**
 * @dev Fetches account information for the specified addresses, with retries if necessary.
 * @param balanceFilterThreshold The minimum balance threshold to filter addresses by.
 * @param addresses The addresses to fetch information for.
 * @param chainId The ID of the chain to fetch information from.
 * @returns An array of strings representing the account information for each address.
 */
export const fetchAccountInfoRetry = async (
  balanceFilterThreshold: number,
  addresses: string[],
  chainId: number
): Promise<string[]> => {
  try {
    const addressFilter = getAddressFilter(chainId);
    return await viewAddressInfo(
      balanceFilterThreshold,
      addresses,
      addressFilter
    );
  } catch (error) {
    console.log("Retrying with different provider... ");
    return await fetchAccountInfoRetry(
      balanceFilterThreshold,
      addresses,
      chainId
    );
  }
};
