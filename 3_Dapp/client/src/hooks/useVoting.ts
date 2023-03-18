import { useEffect, useState } from "react";
import { useAccount, useContractEvent } from "wagmi";
import { useContract, useSigner } from "wagmi";
import artifact from "../contracts/Voting.json";

export function useVoting() {
  const { address } = useAccount()
  const [currentWorkflow, setCurrentWorkflow] = useState<number>(0);
  const [votersAddress, setVotersAddress] = useState<string[]>([]);
  const [lastAddedVoter, setLastAddedVoter] = useState<string>("");
  const [userStatus, setUserStatus] = useState<string>("");
  const { data: signerData } = useSigner();
  
  // EVENTS
  const [proposals, setProposals] = useState<string[]>([]);

  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: "WorkflowStatusChange",
    listener(_, __, owner) {
      //@ts-ignore
      owner?.args?.newStatus && setCurrentWorkflow(owner?.args?.newStatus);
    },
  });

  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: "VoterRegistered",
    listener(_, label, __) {
      //@ts-ignore
      const newVoter = label?.args?.voterAddress;
      if (!votersAddress.find((elem) => elem == newVoter)) {
        setLastAddedVoter(newVoter);
      }
    },
    once: true,
  });

  const voting = useContract({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    (async function () {
      let voterRegisteredFilter = voting?.filters.VoterRegistered();
      let voterRegisteredEvents = await voting?.queryFilter(
        //@ts-ignore
        voterRegisteredFilter
      );
      const votersAddressMap = voterRegisteredEvents?.map(
        (elem) => elem?.args?.voterAddress
      );
      //@ts-ignore
      setVotersAddress(votersAddressMap);
    })();
  }, [signerData]);

  const getUserStatus = async () => {
    const ownerAddr = await voting?.owner.call();

    if (ownerAddr === address) {
      setUserStatus("owner");
      return;
    }

    if (lastAddedVoter === address) {
      setUserStatus("voter");
      return;
    }
    if (votersAddress.find((elem) => elem == address)) {
      setUserStatus("voter");
      return;
    }

    setUserStatus("guest");
  };

  useEffect(() => {
    getUserStatus();
  }, [votersAddress, lastAddedVoter]);

  return { currentWorkflow, voting, votersAddress, userStatus };
}
