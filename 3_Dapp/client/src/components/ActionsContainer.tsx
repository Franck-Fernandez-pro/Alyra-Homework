import { useAccount } from "wagmi";
import { useVoting } from "../hooks";
import AddProposals from "./blocs/AddProposals";
import Vote from "./blocs/Vote";
import Result from "./blocs/Result";
import Card from "./Card";
import AddVoter from "./blocs/AddVoter";

function ActionsContainer() {
  const { currentWorkflow, userStatus } = useVoting();
  const { isConnected } = useAccount();

  return (
    <div className="w-full flex justify-end items-center">
      <div>
        {isConnected ? (
          <>
            {userStatus === "owner" || userStatus === "voter" ? (
              <>
                {currentWorkflow === 0 && <AddVoter />}
                {currentWorkflow === 1 && <AddProposals />}
                {currentWorkflow === 2 && (
                  <Card title="⏳ Enregistrement terminé">
                    L'administrateur passera à la prochaine étape dans quelques
                    instants
                  </Card>
                )}
                {currentWorkflow === 3 && <Vote />}
                {currentWorkflow === 4 && (
                  <Card title="⏳ Vote terminé">
                    L'administrateur passera à la prochaine étape dans quelques
                    instants
                  </Card>
                )}
                {currentWorkflow === 5 && <Result />}
              </>
            ) : (
              <div className="alert alert-warning shadow-lg">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Vous n'êtes ni propriétaire ni électeur, vous ne pouvez-donc pas
                interagir avec cette étape.
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-warning shadow-lg">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Vous devez vous connecter avec un wallet pour interragir avec cette
            app. Utilisez le boutton de connection en haut à droite !
          </div>
        )}
      </div>
    </div>
  );
}

export default ActionsContainer;
