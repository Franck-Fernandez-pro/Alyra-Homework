import { useEffect, useState } from 'react';
import { useAccount, useContractEvent, useContractRead } from 'wagmi';
import { useContract, useSigner } from 'wagmi';
import artifact from '../contracts/Voting.json';
import { toast } from 'react-toastify';

export function useVoting() {
  const { address, isConnected } = useAccount();
  const [lastAddedVoter, setLastAddedVoter] = useState<string>('');
  const [userStatus, setUserStatus] = useState<'owner' | 'guest' | 'voter'>(
    'guest'
  );
  const { data: signerData } = useSigner();

  // EVENTS
  // This data are build from contract events
  const [currentWorkflow, setCurrentWorkflow] = useState<number>(0);
  const [voters, setVoters] = useState<string[]>([]);
  const [proposals, setProposals] = useState<number[]>([1, 2, 3]);

  useEffect(() => {
    // console.log('proposals:', proposals);
  }, [proposals]);
  const { data: votingOwner } = useContractRead({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    functionName: 'owner',
  });

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
  });

  // useContractEvent({
  //   address: import.meta.env.VITE_VOTING_ADDR,
  //   abi: artifact.abi,
  //   eventName: 'ProposalRegistered',
  //   listener(a) {
  //     //@ts-ignore
  //     console.log('a:', a?._hex.toNumber());
  //     //@ts-ignore
  //     // const newVoter = label?.args?.voterAddress;
  //     // if (!voters.find((voter) => voter == newVoter)) {
  //     //   setLastAddedVoter(newVoter);
  //     // }
  //   },
  // });

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
    isConnected && fetchProposals();
  }, [address]);

  // -------------------------------------------------------------------- FUNCTIONS
  async function fetchVoters() {
    if (!voting) return;

    const voterRegisteredFilter = voting.filters.VoterRegistered();
    if (!voterRegisteredFilter) return;

    const voterRegisteredEvents = await voting.queryFilter(
      voterRegisteredFilter
    );
    if (!voterRegisteredEvents) return;

    const fetchedVoters = voterRegisteredEvents.map(
      (voter) => voter?.args?.voterAddress
    ) as string[];

    setVoters(fetchedVoters);
  }

  async function fetchProposals() {
    // if (!voting) return;

    // const proposalRegisteredFilter = voting.filters.ProposalRegistered();
    // console.log('proposalRegisteredFilter:', proposalRegisteredFilter);
    // if (!proposalRegisteredFilter) return;

    // const proposalRegisteredEvents = await voting.queryFilter(
    //   proposalRegisteredFilter
    // );
    // console.log('proposalRegisteredEvents:', proposalRegisteredEvents);
    // if (!proposalRegisteredEvents) return;

    // const fetchedProposals = proposalRegisteredEvents.map(
    //   (proposal) => proposal?.args?.voterAddress
    // ) as string[];
    // console.log('fetchedProposals:', fetchedProposals);

    // setProposals(fetchedProposals);
  }

  async function setVote(proposalId: number) {}

  const getUserStatus = async () => {
    if (!voting || !votingOwner) return;

    if (votingOwner === address) {
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

    setUserStatus('guest');
  };

  async function addVoter(addr: string) {
    try {
      const response = await voting?.addVoter(addr);

      return response;
    } catch (err) {
      throw err;
    }
  }

  async function addProposal(proposal: string) {
    if (!voting) return;

    try {
      const response = await voting.addProposal(proposal);
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
    addProposal,
    lastAddedVoter,
    nextStep,
    proposals,
    setVote,
  };
}
