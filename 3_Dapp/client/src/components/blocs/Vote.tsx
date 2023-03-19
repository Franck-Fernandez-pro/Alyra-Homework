import { toast } from 'react-toastify';
import { useVoting } from '../../hooks';
import Card from '../Card';
import { MouseEvent, useState } from 'react';

export default function Vote({}: {}) {
  const { proposals, setVote } = useVoting();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  async function handleVote() {
    console.log('selectedProposal -> ', selectedProposal);
    // if (!selectedProposal) return;

    // try {
    //   await setVote(selectedProposal);
    //   toast.success('Vous avez voté !');
    //   setSelectedProposal(null);
    // } catch (err) {
    //   toast.error("Une erreur s'est produite");
    // }
  }

  function handleSelect(e: MouseEvent<HTMLDivElement>) {
    setSelectedProposal(parseInt(e.currentTarget.id));
  }

  return (
    <Card
      title="Votez"
      onClick={handleVote}
      btnDisabled={selectedProposal === null}
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
