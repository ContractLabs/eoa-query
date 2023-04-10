import { addresses } from "../../const/addresses";
import { rpcURLs } from "../../const/rpc-urls";
import { Contract, JsonRpcProvider } from "ethers";
import { AddressFilter, AddressFilter__factory } from "../../typechain-types";

const getRpcUrl = (chainId: number): string =>
  rpcURLs[chainId][Math.floor(Math.random() * rpcURLs[chainId].length)];

const getProvider = (chainId: number): JsonRpcProvider =>
  new JsonRpcProvider(getRpcUrl(chainId));

const addressFilter = (chainId: number) =>
  new Contract(addresses[chainId], AddressFilter__factory.abi).connect(
    getProvider(chainId)
  ) as AddressFilter;

const viewAddressInfo = async (
  chainId: number,
  addresses: string[]
): Promise<string[]> => {
  const returnData = await addressFilter(chainId).viewAddressInfo(addresses);
  const one = BigInt(1);
  return addresses
    .filter((_, i) => (returnData[i] & one) == one)
    .map((address, i) => [address, returnData[i] >> one].join(","));
};
