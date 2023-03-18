import { useEffect, useState } from 'react';
import { useContractEvent } from 'wagmi';
import { useContract, useSigner } from 'wagmi'
import artifact from '../contracts/Voting.json';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function useVoting() {
  const [currentWorkflow, setCurrentWorkflow] = useState<number>(0);
  const [votersAddress, setVotersAddress] = useState<string[]>([]);
  const [lastAddedVoter, setLastAddedVoter] = useState<string>("");
  const [userStatus, setUserStatus] = useState<string>("");
  const { data: signerData } = useSigner();


  // @ts-ignore
  const userAddress = signerData?._address;

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

    if (ownerAddr === userAddress) {
      setUserStatus("owner");
      return;
    }

    if (lastAddedVoter === userAddress) {
      setUserStatus("voter");
      return;
    }
    if (votersAddress.find((elem) => elem == userAddress)) {
      setUserStatus("voter");
      return;
    }

    setUserStatus("guest");
  };

  const nextStep = async () => {
    switch(currentWorkflow) {
      case 0:
        try {
          const response = await voting?.startProposalsRegistering();
          toast.success("Etape suivante");
          return response;
        } catch (err) {
          console.error("-> ", err);
          toast.error("Erreur du smart contract");
        }
      case 1:
        try {
          const response = await voting?.endProposalsRegistering();
          toast.success("Etape suivante");
          return response;
        } catch (err) {
          console.error("-> ", err);
          toast.error("Erreur du smart contract");
        }
      case 2:
        try {
          const response = await voting?.startVotingSession();
          toast.success("Etape suivante");
          return response;
        } catch (err) {
          console.error("-> ", err);
          toast.error("Erreur du smart contract");
        }
      case 3:
        try {
          const response = await voting?.endVotingSession();
          toast.success("Etape suivante");
          return response;
        } catch (err) {
          console.error("-> ", err);
          toast.error("Erreur du smart contract");
        }
      case 4:
        try {
          const response = await voting?.tallyVotes();
          toast.success("Etape suivante");
          return response;
        } catch (err) {
          console.error("-> ", err);
          toast.error("Erreur du smart contract");
        }
      case 5:
        toast.info("Session de vote terminée");
    }
  };

  useEffect(() => {
    getUserStatus();
  }, [votersAddress, lastAddedVoter]);


  return { currentWorkflow, voting, votersAddress, userStatus, lastAddedVoter, nextStep };
}
