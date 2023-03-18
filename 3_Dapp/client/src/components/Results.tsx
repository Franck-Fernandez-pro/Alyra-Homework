import { useVoting } from "../hooks";

function Results() {
  const { currentWorkflow } = useVoting();

  return (
    <div className="flex w-full justify-center">
      <div>results</div>
    </div>
  );
}

export default Results;
