import { useVoting } from '../hooks';

interface Props {
  dataToDisplay: 'voters' | 'votes';
}

function VotingList({ dataToDisplay }: Props) {
  const { voters, proposals } = useVoting();

  return (
    <div className="flex w-full flex-col justify-center gap-5">
      {dataToDisplay === 'voters' && (
        <>
          <h3 className="mb-3 text-2xl font-bold">Liste des élécteurs</h3>
          <div className="flex flex-col items-center justify-center gap-3">
            {voters
              .filter((v, i) => voters.indexOf(v) === i)
              .map((voter, idx) => (
                <div
                  className="badge badge-secondary cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(voter)}
                  key={idx}
                >
                  {voter}
                </div>
              ))}
          </div>
        </>
      )}
      {dataToDisplay === 'votes' && (
        <>
          <h3 className="mb-3 text-2xl font-bold">Liste des propositions</h3>
          <div className="flex flex-col items-center justify-center gap-3">
            {proposals.length
              ? proposals
                  .filter((v, i) => proposals.indexOf(v) === i)
                  .map((proposal, idx) => (
                    <div
                      className="badge badge-primary cursor-pointer"
                      onClick={() =>
                        navigator.clipboard.writeText(proposal.toString())
                      }
                      key={idx}
                    >
                      {proposal.description}
                    </div>
                  ))
              : "Il n'y a pas encore de propositions"}
          </div>
        </>
      )}
    </div>
  );
}

export default VotingList;
