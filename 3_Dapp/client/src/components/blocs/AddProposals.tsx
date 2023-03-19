import { toast } from 'react-toastify';
import { useInput, useVoting } from '../../hooks';
import Card from '../Card';

export default function AddProposals({}: {}) {
  const { props: proposalField, setValue } = useInput<string>('');
  const { addProposal } = useVoting();

  async function handleAddProposal() {
    if (proposalField.value !== '') {
      try {
        await addProposal(proposalField.value);
        toast.success('Proposition ajouté');
        setValue('');
      } catch (err) {
        toast.error("Une erreur s'est produite");
      }
    }
  }

  return (
    <Card
      title="Ajouter une proposaition"
      onClick={handleAddProposal}
      btnDisabled={proposalField.value === ''}
    >
      <input
        className="input input-bordered input-sm w-full max-w-xs"
        type="text"
        placeholder="Café gratuit"
        {...proposalField}
      />
    </Card>
  );
}
