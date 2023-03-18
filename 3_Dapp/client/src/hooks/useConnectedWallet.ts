import { useSigner } from "wagmi";

export function useConnectedWallet() {
  const { data: signer } = useSigner();
  // @ts-ignore
  const userAddress = signer?._address;

  return { userAddress };
}
