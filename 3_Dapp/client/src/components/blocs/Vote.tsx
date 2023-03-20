import { toast } from 'react-toastify';
import { useVoting } from '../../hooks';
import Card from '../Card';
import { MouseEvent, useState } from 'react';

export default function Vote({}: {}) {
  const { proposals, setVote, voter } = useVoting();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  async function handleVote() {
    if (!selectedProposal) return;

    try {
      await setVote(selectedProposal);
      toast.success('Vous avez voté !');
      setSelectedProposal(null);
    } catch (err) {
      toast.error("Une erreur s'est produite");
    }
  }

  function handleSelect(e: MouseEvent<HTMLDivElement>) {
    setSelectedProposal(parseInt(e.currentTarget.id));
  }

  return voter?.hasVoted ? (
    <Card title="📬 A voté">
      <div className="flex space-x-1">
        Votre vote a bien été enregistré. L'administrateur passera à la
        prochaine étape dans quelques instants
      </div>
    </Card>
  ) : (
    <Card
      title="Votez"
      onClick={handleVote}
      btnDisabled={selectedProposal === null}
      btnText="Voter"
    >
      <div className="flex space-x-1">
        {proposals &&
          proposals.map((p, idx) => (
            <div
              className={`badge cursor-pointer ${
                selectedProposal === p ? 'badge-secondary' : 'badge-primary'
              }`}
              key={idx}
              id={p.toString()}
              onClick={handleSelect}
            >
              {p}
            </div>
          ))}
      </div>
    </Card>
  );
}
