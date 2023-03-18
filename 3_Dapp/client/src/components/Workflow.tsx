import WorkflowStatus from "./WorkflowStatus";
import { useVoting } from "../hooks";

function Workflow() {
  const { currentWorkflow } = useVoting();

  const getStatus = (workflow: number) => {
    if (currentWorkflow === workflow) return "current";
    if (currentWorkflow > workflow) return "done";
    return "pending";
  };

  return (
    <div className="flex w-full flex-col items-end gap-5">
      <WorkflowStatus
        status={getStatus(0)}
        label="Enregistrement des élécteurs"
      />
      <WorkflowStatus
        status={getStatus(1)}
        label="Enregistrement des proposition en cours"
      />
      <WorkflowStatus
        status={getStatus(2)}
        label="Enregistrement des propositions fermé"
      />
      <WorkflowStatus status={getStatus(3)} label="Session de vote en cours" />
      <WorkflowStatus status={getStatus(4)} label="Session de vote fermée" />
      <WorkflowStatus status={getStatus(5)} label="Résultats des votes" />
    </div>
  );
}

export default Workflow;
