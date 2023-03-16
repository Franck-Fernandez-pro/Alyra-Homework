import { useVoting } from '../hooks';

function Results() {
  const { currentWorkflow } = useVoting();

  return (
    <div className="w-full flex justify-center">
      <div>results</div>
    </div>
  );
}

export default Results;
