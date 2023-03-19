import { useVoting } from '../hooks';

interface Props {
  dataToDisplay: string;
}

function VotingList({ dataToDisplay }: Props) {
  const { voters } = useVoting();
  const VOTES_TEMPO = [
    "azerty",
    "azerty",
    "azerty",
    "azerty",
    "azerty",
    "azerty"
  ]

  return (
    <div className="flex flex-col justify-center gap-5 w-full">
      { dataToDisplay === "voters" && (
        <>
          {voters.map((voter) => {
            return(
              <div
                className="badge badge-tertiary cursor-pointer w-full"
                onClick={() => navigator.clipboard.writeText(voter)}
              >
                {voter}
              </div>
            )
          })}
        </>
      )}
      { dataToDisplay === "votes" && (
        <>
          {VOTES_TEMPO.map((elem) => {
            return(
              <div
                className="badge badge-tertiary cursor-pointer w-full"
                onClick={() => navigator.clipboard.writeText(elem)}
              >
                {elem}
              </div>
            )
          })}
        </>
      )}
    </div>
  );
}

export default VotingList;
