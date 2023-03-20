import { useVoting } from '../hooks';

interface Props {
  dataToDisplay: 'voters' | 'votes';
}

function VotingList({ dataToDisplay }: Props) {
  const { voters } = useVoting();
  const VOTES_TEMPO = [
    'azerty',
    'azerty',
    'azerty',
    'azerty',
    'azerty',
    'azerty',
  ];

  return (
    <div className="flex w-full flex-col justify-center gap-5">
      {dataToDisplay === 'voters' && (
        <>
          {voters.map((voter, idx) => (
            <div
              className="badge badge-tertiary w-full cursor-pointer"
              onClick={() => navigator.clipboard.writeText(voter)}
              key={idx}
            >
              {voter}
            </div>
          ))}
        </>
      )}
      {dataToDisplay === 'votes' && (
        <>
          {VOTES_TEMPO.map((vote, idx) => (
            <div
              className="badge badge-tertiary w-full cursor-pointer"
              onClick={() => navigator.clipboard.writeText(vote)}
              key={idx}
            >
              {vote}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default VotingList;
