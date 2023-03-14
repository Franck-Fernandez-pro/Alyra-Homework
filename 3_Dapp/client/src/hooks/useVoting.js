import { useEffect, useState } from 'react';
import useEth from '../contexts/EthContext/useEth';

export function useVoting() {
  const {
    state: { contract },
  } = useEth();
  const [currentWorkflow, setCurrentWorkflow] = useState(0);

  useEffect(() => {
    async function fetchWorkflowStatusEvents() {
      if (!contract) {
        return;
      }

      let oldEvents = await contract.getPastEvents('WorkflowStatusChange', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      if (oldEvents) {
        setCurrentWorkflow(
          oldEvents[oldEvents.length - 1].returnValues.newStatus
        );
      }

      await contract.events
        .WorkflowStatusChange({ fromBlock: 'earliest' })
        .on('data', (event) => {
          setCurrentWorkflow(event.returnValues.newStatus);
        });
    }

    fetchWorkflowStatusEvents();
  }, [contract]);

  return { currentWorkflow };
}
