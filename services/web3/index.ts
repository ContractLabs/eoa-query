import { rpcURLs } from "../../const/rpc-urls";
import { addresses } from "../../const/addresses";
import { Contract, JsonRpcProvider } from "ethers";
import { AddressFilter, AddressFilter__factory } from "../../typechain-types";

const getRpcUrl = (chainId: number): string =>
  rpcURLs[chainId][Math.floor(Math.random() * rpcURLs[chainId].length)];

const getProvider = (chainId: number): JsonRpcProvider =>
  new JsonRpcProvider(getRpcUrl(chainId));

const getAddressFilter = (chainId: number) =>
  new Contract(addresses[chainId], AddressFilter__factory.abi).connect(
    getProvider(chainId)
  ) as AddressFilter;

export const viewAddressInfo = async (
  balanceFilterThreshold: number,
  addresses: string[],
  addressFilter: AddressFilter
): Promise<string[]> => {
  const returnData = await addressFilter.viewAddressInfo.staticCall(addresses);
  const one = BigInt(1);
  return addresses
    .filter(
      (_, i) =>
        (returnData[i] & one) == one ||
        returnData[i] >> one <= BigInt(balanceFilterThreshold)
    )
    .map((address, i) => [`'${address}'`, returnData[i] >> one].join(","));
};

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
    console.log({ error });
    console.log("Retrying with different provider... ");
    return await fetchAccountInfoRetry(
      balanceFilterThreshold,
      addresses,
      chainId
    );
  }
};
