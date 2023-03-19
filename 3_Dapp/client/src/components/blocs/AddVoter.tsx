import { useInput, useVoting } from '../../hooks';
import { toast } from 'react-toastify';
import { isAddress } from 'ethers/lib/utils.js';
import Card from '../Card';

function AddVoter() {
  const { props: addressField, setValue } = useInput<string>('');
  const { userStatus, addVoter } = useVoting();

  const handleClickAdd = async () => {
    if (isAddress(addressField.value)) {
      try {
        await addVoter(addressField.value);
        toast.success('Élécteur ajouté');
      } catch (err) {
        toast.error('Erreur du smart contract');
      }
    } else {
      toast.error("Ce n'est pas une adresse");
    }

    setValue('');
  };

  return (
    <Card title="✏️ Ajouter des voteurs" onClick={handleClickAdd}>
      {userStatus === 'owner' && (
        <input
          className="input input-bordered input-sm w-full max-w-xs"
          type="text"
          placeholder="0xf0535..."
          {...addressField}
        />
      )}
      {userStatus === 'voter' && (
        <div className="alert alert-success shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Vous avez été ajouté en tant qu'élécteur, vous pourrez interragir
            aux prochaines étapes !
          </span>
        </div>
      )}
    </Card>
  );
}

export default AddVoter;
