import { useVoting } from '../../hooks';
import Card from '../Card';

function Result() {
  const { winningProposal } = useVoting();

  return (
    <Card title="🎉 Résultat du vote">
      {winningProposal ? (
        <p>
          Le vaiqueur est{' '}
          <span className="text-primary font-bold">
            {winningProposal.description}
          </span>
        </p>
      ) : (
        "Une erreur s'est produite"
      )}
    </Card>
  );
}

export default Result;
