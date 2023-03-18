import { useEffect, useState } from 'react';
import { useAccount, useContractEvent } from 'wagmi';
import { useContract, useSigner } from 'wagmi';
import artifact from '../contracts/Voting.json';

export function useVoting() {
  const { address } = useAccount();
  const [lastAddedVoter, setLastAddedVoter] = useState<string>('');
  const [userStatus, setUserStatus] = useState<string>('');
  const { data: signerData } = useSigner();

  // EVENTS
  // This data are build from contract events
  const [currentWorkflow, setCurrentWorkflow] = useState<number>(0);
  const [voters, setVoters] = useState<string[]>([]);
  const [proposals, setProposals] = useState<string[]>([]);

  const voting = useContract({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });

  // -------------------------------------------------------------------- EFFECTS
  //- ADD COMMENT
  useEffect(() => {
    getUserStatus();
  }, [voters, lastAddedVoter]);

  // SETUP CONTRACT'S EVENT LISTENER
  useEffect(() => {
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
        if (!voters.find((elem) => elem == newVoter)) {
          setLastAddedVoter(newVoter);
        }
      },
      once: true,
    });
  }, []);

  // FETCH CONTRACT EVENTS
  useEffect(() => {
    fetchVoters();
  }, [signerData]);

  // -------------------------------------------------------------------- FUNCTIONS
  async function fetchVoters() {
    const voterRegisteredFilter = voting?.filters.VoterRegistered();
    if (!voterRegisteredFilter) return;

    const voterRegisteredEvents = await voting?.queryFilter(
      voterRegisteredFilter
    );
    const fetchedVoters = voterRegisteredEvents?.map(
      (voter) => voter?.args?.voterAddress
    ) as string[];

    setVoters(fetchedVoters);
  }

  const getUserStatus = async () => {
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

  return { currentWorkflow, voting, voters, userStatus, addVoter };
}
