import { useInput, useVoting } from '../../hooks';

export function AddProposals({}: {}) {
  const { props: proposalField, setValue } = useInput<string>('');
  const { userStatus } = useVoting();

  function handleAddProposal() {
    if (proposalField.value !== '') {
    }
  }

  return userStatus === 'owner' || userStatus === 'voter' ? (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body space-y-5">
        <h2 className="card-title">Ajouter une proposaition</h2>
        <input
          className="input input-bordered input-sm w-full max-w-xs"
          type="text"
          placeholder="Café gratuit"
          {...proposalField}
        />

        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddProposal}
            disabled={proposalField.value === ''}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  ) : (
    <>'PAS OK'</>
  );
}
