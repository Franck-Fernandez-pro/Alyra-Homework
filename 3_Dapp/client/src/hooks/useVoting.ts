import { useEffect, useState } from 'react';
import { useAccount, useContractEvent } from 'wagmi';
import { useContract, useSigner } from 'wagmi';
import artifact from '../contracts/Voting.json';
import { toast } from 'react-toastify';

export function useVoting() {
  const { address, isConnected } = useAccount();
  const [lastAddedVoter, setLastAddedVoter] = useState<string>('');
  const [userStatus, setUserStatus] = useState<string>('');
  const { data: signerData } = useSigner();

  // EVENTS
  // This data are build from contract events
  const [currentWorkflow, setCurrentWorkflow] = useState<number>(0);
  const [voters, setVoters] = useState<string[]>([]);
  const [proposals, setProposals] = useState<string[]>([]);

  // SETUP CONTRACT'S EVENT LISTENER
  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: 'WorkflowStatusChange',
    listener(_, __, owner) {
      //@ts-ignore
      owner?.args?.newStatus && setCurrentWorkflow(owner?.args?.newStatus);
    },
  });

  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: 'VoterRegistered',
    listener(_, label, __) {
      //@ts-ignore
      const newVoter = label?.args?.voterAddress;
      if (!voters.find((voter) => voter == newVoter)) {
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

  // -------------------------------------------------------------------- EFFECTS
  //- ADD COMMENT
  useEffect(() => {
    getUserStatus();
  }, [address]);

  // FETCH CONTRACT EVENTS
  useEffect(() => {
    isConnected && fetchVoters();
  }, [address]);

  // -------------------------------------------------------------------- FUNCTIONS
  async function fetchVoters() {
    if (!voting) return;

    const voterRegisteredFilter = voting.filters.VoterRegistered();
    console.log('voterRegisteredFilter:', voterRegisteredFilter);
    if (!voterRegisteredFilter) return;

    const voterRegisteredEvents = await voting.queryFilter(
      voterRegisteredFilter
    );
    console.log('voterRegisteredEvents:', voterRegisteredEvents);
    if (!voterRegisteredEvents) return;

    const fetchedVoters = voterRegisteredEvents.map(
      (voter) => voter?.args?.voterAddress
    ) as string[];
    console.log('fetchedVoters:', fetchedVoters);

    setVoters(fetchedVoters);
  }

  const getUserStatus = async () => {
    if (!isConnected) {
      setUserStatus('guest');
      return;
    }

    const ownerAddr = await voting?.owner.call();

    if (ownerAddr === address) {
      setUserStatus('owner');
      return;
    }

    if (lastAddedVoter === address) {
      setUserStatus('voter');
      return;
    }
    if (voters.find((voter) => voter == address)) {
      setUserStatus('voter');
      return;
    }
  };

  async function addVoter(addr: string) {
    try {
      const response = await voting?.addVoter(addr);

      return response;
    } catch (err) {
      throw err;
    }
  }

  const nextStep = async () => {
    switch (currentWorkflow) {
      case 0:
        try {
          const response = await voting?.startProposalsRegistering();
          toast.success('Etape suivante');
          return response;
        } catch (err) {
          console.error('-> ', err);
          toast.error('Erreur du smart contract');
        }
      case 1:
        try {
          const response = await voting?.endProposalsRegistering();
          toast.success('Etape suivante');
          return response;
        } catch (err) {
          console.error('-> ', err);
          toast.error('Erreur du smart contract');
        }
      case 2:
        try {
          const response = await voting?.startVotingSession();
          toast.success('Etape suivante');
          return response;
        } catch (err) {
          console.error('-> ', err);
          toast.error('Erreur du smart contract');
        }
      case 3:
        try {
          const response = await voting?.endVotingSession();
          toast.success('Etape suivante');
          return response;
        } catch (err) {
          console.error('-> ', err);
          toast.error('Erreur du smart contract');
        }
      case 4:
        try {
          const response = await voting?.tallyVotes();
          toast.success('Etape suivante');
          return response;
        } catch (err) {
          console.error('-> ', err);
          toast.error('Erreur du smart contract');
        }
      case 5:
        toast.info('Session de vote terminée');
    }
  };

  return {
    currentWorkflow,
    voting,
    voters,
    userStatus,
    addVoter,
    lastAddedVoter,
    nextStep,
  };
}
