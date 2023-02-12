1. En tant qu'owner, ajouter des utilisateurs avec `addVoter`.
2. En tant qu'owner, passez au `WorkflowStatus` suivant (ProposalsRegistrationStarted) avec `incrementStatus`.
3. En tant qu'owner ou voter, vous pouvez ajouter une proposition avec `addProposal`.
4. En tant qu'owner, passez au `WorkflowStatus` suivant (ProposalsRegistrationEnded) avec `incrementStatus`.
5. En tant qu'owner, passez au `WorkflowStatus` suivant (VotingSessionStarted) avec `incrementStatus`.
6. En tant qu'owner ou voter, vous pouvez voter pour une proposition avec `vote`.
7. En tant qu'owner, passez au `WorkflowStatus` suivant (VotingSessionEnded) avec `incrementStatus`.
8. En tant qu'owner, clôturez le vote avec `winningProposal`.
   - Trouve la proposition avec le plus de votes.
   - Passe le `WorkflowStatus` à `VotesTallied`.
9. Une fois le vote terminé.
   - Tout le monde peut récupérer l'index de proposition gagnante avec `getWinner()`.
   - Tout le monde peut vérifier le comptage avec `getMostVoted()`.

- Le getter `proposalIds` permet de récupérer l'index d'une proposition par sa description. Attention, si la description n'existe pas, l'index retourné sera 0 par défaut. Vous devez vérifier que la proposition à cet index soit bien celle que vous cherchez.
