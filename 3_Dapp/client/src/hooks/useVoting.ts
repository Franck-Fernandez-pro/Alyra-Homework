import { useState } from 'react';
import { useContractEvent } from 'wagmi';
import artifact from '../contracts/Voting.json';

export function useVoting() {
  const [currentWorkflow, setCurrentWorkflow] = useState<number>(0);
  useContractEvent({
    address: import.meta.env.VITE_VOTING_ADDR,
    abi: artifact.abi,
    eventName: 'WorkflowStatusChange',
    listener(_, __, owner) {
      //@ts-ignore
      owner?.args?.newStatus && setCurrentWorkflow(owner?.args?.newStatus);
    },
  });

  return { currentWorkflow };
}
