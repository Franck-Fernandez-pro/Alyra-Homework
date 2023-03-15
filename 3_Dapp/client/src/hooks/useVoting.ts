import { useState } from 'react';
import { useContractEvent } from 'wagmi';
import { useContract, useSigner } from 'wagmi'
import artifact from '../contracts/Voting.json';

export function useVoting() {
  const [currentWorkflow, setCurrentWorkflow] = useState<number>(0);
  const { data: signerData } = useSigner();
  
  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: 'WorkflowStatusChange',
    listener(_, __, owner) {
      //@ts-ignore
      owner?.args?.newStatus && setCurrentWorkflow(owner?.args?.newStatus);
    },
  });

  const voting = useContract({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    signerOrProvider: signerData,
  })

  return { currentWorkflow, voting };
}
