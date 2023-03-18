import { useConnectedWallet, useVoting } from '../hooks';
import BlockWorkflow1 from './blocs/BlocWorkflow1';

function ActionsContainer() {
  const { currentWorkflow, userStatus } = useVoting();
  const { userAddress } = useConnectedWallet();

  const getWorkflowTitle = () => {
    switch(currentWorkflow) {
      case 0:
        return "Enregistrez un ou plusieurs élécteurs grâce à leurs adresses (0x00...)"
      case 1:
        return "Enregistrez une proposition de vote"
      case 2:
        return "La session d'enregistrement des propositions terminée"
      case 3:
        return "Votez pour une des propositions enregistrées"
      case 4:
        return "La session de vote est terminée"
      case 5:
        return "Processus de vote terminé les résultats sont disponibles"
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-xl border bg-base-content w-3/4 h-full flex flex-col justify-center">
        <h1 className="text-white text-center text-lg m-3">{getWorkflowTitle()}</h1>
        <div className="h-full w-full items-center justify-center p-9">
          { userAddress ?
            <>
             { userStatus === "owner" || userStatus === "voter" ?
                <>
                  {currentWorkflow === 0 &&
                    <BlockWorkflow1 />
                  }
                  {currentWorkflow === 1 &&
                    <div className="text-white">interface wf 1</div>
                  }
                  {currentWorkflow === 2 &&
                    <div className="text-white">interface wf 2</div>
                  }
                  {currentWorkflow === 3 &&
                    <div className="text-white">interface wf 3</div>
                  }
                  {currentWorkflow === 4 &&
                    <div className="text-white">interface wf 4</div>
                  }
                  {currentWorkflow === 5 &&
                    <div className="text-white">interface wf 5</div>
                  }
                </>
             :
              <div className="alert alert-warning shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Vous n'êtes ni propriétaire ni électeur, vous ne pouvez-donc pas interagir avec cette étape.
              </div>
             }
            </>
          :
          <div className="alert alert-warning shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Vous devez vous connecter avec un wallet pour interragir avec cette app. Utilisez le boutton de connection en haut à droite !
          </div>
          }
        </div>
      </div>
    </div>
  );
}

export default ActionsContainer;
