import { useState } from 'react';
import { useVoting } from '../hooks';
import VotingList from './VotingList';

function UtilsInterface () {
  const { userStatus, nextStep } = useVoting();
  const [display, setDisplay] = useState<string>("");

  const handleSeeVoters = () => {
    setDisplay("voters");
  };

  const handleSeeVotes = () => {
    setDisplay("votes");
  };

  const handleNextStep = () => {
    console.log("next step");
    nextStep();
  };

  return (
    <div className="flex justify-center">
      { (userStatus == "voter" || userStatus == "owner") && (
        <div className="alert shadow-lg w-1/2 flex justify-around">
            <label htmlFor="my-modal" onClick={handleSeeVoters} className="btn">Voir les élécteurs</label>
            <label htmlFor="my-modal" onClick={handleSeeVotes} className="btn">Voir les votes</label>
            
            { userStatus === "owner" && 
              <button onClick={handleNextStep} className="btn btn-secondary">Étape suivante</button>
            }

            <input type="checkbox" id="my-modal" className="modal-toggle" />

            <div className="modal">
              <div className="modal-box">
                <VotingList dataToDisplay={display}/>
                <div className="modal-action">
                  <label htmlFor="my-modal" className="btn">fermer</label>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default UtilsInterface;