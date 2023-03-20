import WorkflowStatus from "./WorkflowStatus";
import { useVoting } from "../hooks";

function Workflow() {
  const { currentWorkflow } = useVoting();

  const getStatus = (workflow: number) => {
    if (currentWorkflow >= workflow) return "step-primary";
    return "";
  };

  return (
    <ul className="steps steps-vertical w-full">
      <li className={`step ${getStatus(0)}`}>Enregistrement des élécteurs</li>
      <li className={`step ${getStatus(1)}`}>Enregistrement des proposition en cours</li>
      <li className={`step ${getStatus(2)}`}>Enregistrement des propositions fermé</li>
      <li className={`step ${getStatus(3)}`}>Session de vote en cours</li>
      <li className={`step ${getStatus(4)}`}>Session de vote fermée</li>
      <li className={`step ${getStatus(5)}`}>Résultats des votes disponibles</li>
    </ul>
  );
}

export default Workflow;
