import { useEffect, useState } from "react";
import WorkflowStatus from "./workflowStatus";
import useEth from "../contexts/EthContext/useEth";

function Workflow() {
  const { state: { contract, accounts } } = useEth();

  const [currentWorkflow, setCurrentWorkflow] = useState(0);

  useEffect(() => {
    (async () => {
      let oldEvents = await contract.getPastEvents('WorkflowStatusChange', {
        fromBlock: 0,
        toBlock: 'latest'
      });
  
      if (oldEvents) {
        setCurrentWorkflow(oldEvents[oldEvents.length - 1].returnValues.newStatus);
      }
  
      await contract.events.WorkflowStatusChange({ fromBlock: "earliest" })
        .on("data", event => {
          setCurrentWorkflow(event.returnValues.newStatus)
        })          
        .on("changed", changed => console.log(changed))
        .on("error", err => console.log(err))
        .on("connected", str => console.log(str))
    })();
  }, [contract])

  const getStatus = (workflow) => {
    console.log("current wf ", currentWorkflow, " comp wf ",  workflow);
    if (currentWorkflow == workflow) { return "current" }
    if (currentWorkflow > workflow) { return "done" }
    return "pending";
  };

  return (
    <div className="border">
      <WorkflowStatus status={getStatus(0)} label="Enregistrement des voteurs" />
      <WorkflowStatus status={getStatus(1)} label="Enregistrement des proposition en cours" />
      <WorkflowStatus status={getStatus(2)} label="Enregistrement des propositions fermé" />
      <WorkflowStatus status={getStatus(3)} label="Session de vote en cours" />
      <WorkflowStatus status={getStatus(4)} label="Session de vote fermée" />
      <WorkflowStatus status={getStatus(5)} label="Résultats des votes" />
    </div>
  );
}

export default Workflow;
