import { useState } from 'react';
import { useVoting } from '../hooks';
import VotingList from './VotingList';

function UtilsInterface() {
  const { userStatus, nextStep } = useVoting();
  const [display, setDisplay] = useState<'voters' | 'votes'>('votes');

  const handleSeeVoters = () => {
    setDisplay('voters');
  };

  const handleSeeVotes = () => {
    setDisplay('votes');
  };

  const handleNextStep = () => {
    nextStep();
  };

  return (
    <div className="flex justify-center">
      {(userStatus == 'voter' || userStatus == 'owner') ? (
        <div className="flex space-x-5">
          <label htmlFor="my-modal" onClick={handleSeeVoters} className="btn">
            Voir les élécteurs
          </label>
          <label htmlFor="my-modal" onClick={handleSeeVotes} className="btn">
            Voir les propositions
          </label>

          {userStatus === 'owner' && (
            <button onClick={handleNextStep} className="btn btn-secondary">
              Étape suivante
            </button>
          )}

          <input type="checkbox" id="my-modal" className="modal-toggle" />

          <div className="modal">
            <div className="modal-box">
              <VotingList dataToDisplay={display} />
              <div className="modal-action">
                <label htmlFor="my-modal" className="btn">
                  fermer
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full text-center">
          Vous n'êtes pas connecté ou pas autorisé à avoir accès à cette interface
        </div>
      )}
    </div>
  );
}

export default UtilsInterface;
