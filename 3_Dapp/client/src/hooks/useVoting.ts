import { useEffect, useState } from 'react';
import { useAccount, useContractEvent, useContractRead } from 'wagmi';
import { useContract, useSigner } from 'wagmi';
import artifact from '../contracts/Voting.json';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export interface Voter {
  hasVoted: boolean;
  isRegistered: boolean;
  votedProposalId: VotedProposalID;
}

export interface VotedProposalID {
  _type: string;
  _hex: string;
}

interface Proposal {
  id: number;
  description: string;
  voteCount: number;
}

export function useVoting() {
  const { data: signerData } = useSigner();
  const voting = useContract({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });
  const { address } = useAccount();
  const [voter, setVoter] = useState<Voter | null>(null);
  const [userStatus, setUserStatus] = useState<'owner' | 'guest' | 'voter'>(
    'guest'
  );

  // EVENTS
  // This data are build from contract events
  const [voters, setVoters] = useState<string[]>([]);
  const userIsVoter: boolean = address ? voters?.includes(address) : false;
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const { data: votingOwner } = useContractRead({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    functionName: 'owner',
  });

  const { data: connectedVoter } = useContractRead({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    functionName: 'getVoter',
    args: [address],
    enabled: userIsVoter,
    watch: true,
  });

  const { data: currentWorkflowStatus } = useContractRead({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    functionName: 'workflowStatus',
    watch: true,
  });
  const currentWorkflow = currentWorkflowStatus as number;

  const { data: winningProposalIdResponse } = useContractRead({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    functionName: 'winningProposalID',
    watch: true,
  });
  const winningProposalId = winningProposalIdResponse
    ? ethers.BigNumber.from(winningProposalIdResponse).toNumber()
    : 0;

  const winningProposal: Proposal | undefined = proposals.find(
    (p) => p.id === winningProposalId
  );

  // -------------------------------------------------------------------- SETUP CONTRACT'S EVENT LISTENER
  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: 'VoterRegistered',
    listener(_, label) {
      //@ts-ignore
      const newVoter = label?.args?.voterAddress;
      if (!voters.includes(newVoter)) {
        setVoters((prevVoter) => [...prevVoter, newVoter]);
      }
    },
  });

  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: 'ProposalRegistered',
    listener(newProposal) {
      const newP = ethers.BigNumber.from(newProposal).toNumber();

      !proposals.includes(newP) && setProposals((p) => [...p, newP]);
    },
  });

  // -------------------------------------------------------------------- EFFECTS
  // FETCH USER STATUS
  useEffect(() => {
    getUserStatus();
  }, [address, voters]);

  // FETCH CURRENT VOTER
  useEffect(() => {
    if (connectedVoter) {
      const { isRegistered, hasVoted, votedProposalId } =
        connectedVoter as Voter;
      setVoter({ isRegistered, hasVoted, votedProposalId });
    }
  }, [connectedVoter]);

  // FETCH CONTRACT EVENTS
  useEffect(() => {
    console.log('FETCH CONTRACT EVENTS');
    voters.length === 0 && fetchVoters();
    proposals.length === 0 && fetchProposals();
  });

  // -------------------------------------------------------------------- FUNCTIONS
  async function fetchVoters() {
    if (!voting) return;

    try {
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
    } catch (error) {
      // console.error(error);
    }
  }

  async function fetchProposals() {
    if (!voting) return;
    const filter = voting.filters.ProposalRegistered();

    try {
      const result = await voting.queryFilter(filter);

      const proposals = result.map((proposal) => {
        //@ts-ignore
        const pId = ethers.BigNumber.from(proposal.args.proposalId).toNumber();
        return voting.getOneProposal(pId).then((proposalObject: any) => ({
          id: pId,
          voteCount: ethers.BigNumber.from(proposalObject.voteCount).toNumber(),
          description: proposalObject.description,
        }));
      });
      const response = await Promise.all(proposals);
      setProposals(response);
    } catch (error) {
      // console.error(error);
    }
  }

  async function setVote(proposalId: number) {
    if (!voting) return;

    try {
      const response = await voting.setVote(proposalId);

      return response;
    } catch (err) {
      throw err;
    }
  }

  const getUserStatus = async () => {
    if (!voting || !votingOwner) return;

    if (votingOwner === address) {
      setUserStatus('owner');
      return;
    }

    if (address && voters.includes(address)) {
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
    voter,
    userStatus,
    addVoter,
    addProposal,
    nextStep,
    proposals,
    setVote,
    winningProposal,
  };
}
