const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const _workflowStatus = {
  RegisteringVoters: new BN(0),
  ProposalsRegistrationStarted: new BN(1),
  ProposalsRegistrationEnded: new BN(2),
  VotingSessionStarted: new BN(3),
  VotingSessionEnded: new BN(4),
  VotesTallied: new BN(5),
};
const _event = {
  VoterRegistered: "VoterRegistered",
  WorkflowStatusChange: "WorkflowStatusChange",
  ProposalRegistered: "ProposalRegistered",
  Voted: "Voted",
};

const setVoters = async (contract, voters, _owner) =>
  voters.map(async (voter) => await contract.addVoter(voter, { from: _owner }));

//----------------------------------------------------------------------------------------
//----------------------------            VOTING          --------------------------------
//----------------------------------------------------------------------------------------
contract("Voting", (accounts) => {
  let voting;
  const _owner = accounts[0];
  const _voter1 = accounts[1];
  const _voter2 = accounts[2];
  const _voter3 = accounts[3];
  const _notVoter = accounts[4];
  const _proposal1 = "Toto";
  const _proposal2 = "Tata";
  const _proposal3 = "Tutu";

  beforeEach(async () => {
    voting = await Voting.new({ from: _owner });
  });

  //----------------------------------------------------------------------------------------
  //--------------------------           INITIAL STATE         -----------------------------
  //----------------------------------------------------------------------------------------
  describe("Initial contract state", () => {
    it("_owner is contract owner", async () => {
      expect(await voting.owner.call()).to.be.eq(_owner);
    });

    it("RegisteringVoters is default workflowStatus", async () => {
      expect(await voting.workflowStatus.call()).to.be.bignumber.eq(
        _workflowStatus.RegisteringVoters
      );
    });

    describe("steps that should revert", () => {
      beforeEach(async () => {
        await voting.addVoter(_owner, { from: _owner });
      });

      it("addProposal() should revert", async () => {
        await expectRevert(
          voting.addProposal("proposal", { from: _owner }),
          "Proposals are not allowed yet"
        );
      });

      it("setVote() should revert", async () => {
        await expectRevert(
          voting.setVote(0, { from: _owner }),
          "Voting session havent started yet"
        );
      });

      it("endProposalsRegistering() should revert", async () => {
        await expectRevert(
          voting.endProposalsRegistering({ from: _owner }),
          "Registering proposals havent started yet"
        );
      });

      it("startVotingSession() should revert", async () => {
        await expectRevert(
          voting.startVotingSession({ from: _owner }),
          "Registering proposals phase is not finished"
        );
      });

      it("endVotingSession() should revert", async () => {
        await expectRevert(
          voting.endVotingSession({ from: _owner }),
          "Voting session havent started yet"
        );
      });

      it("tallyVotes() should revert", async () => {
        await expectRevert(
          voting.tallyVotes({ from: _owner }),
          "Current status is not voting session ended"
        );
      });
    });
  });

  //----------------------------------------------------------------------------------------
  //------------------------------       REGISTER VOTERS      ------------------------------
  //----------------------------------------------------------------------------------------
  describe("RegisteringVoters", () => {
    it("addVoter() should emit VoterRegistered event", async () => {
      const recipient = await voting.addVoter(_voter1, { from: _owner });
      expectEvent(recipient, _event.VoterRegistered, { voterAddress: _voter1 });
    });

    it("_owner can addVoter()", async () => {
      await voting.addVoter(_owner, { from: _owner });
      const { isRegistered, votedProposalId, hasVoted } =
        await voting.getVoter.call(_owner, {
          from: _owner,
        });

      expect(isRegistered).to.be.true;
      expect(votedProposalId).to.be.bignumber.eq(new BN(0));
      expect(hasVoted).to.be.false;
    });

    it("check voter struct after register", async () => {
      await voting.addVoter(_owner, { from: _owner });
      const { hasVoted, votedProposalId } = await voting.getVoter.call(_owner, {
        from: _owner,
      });

      expect(hasVoted).to.be.false;
      expect(votedProposalId).to.be.bignumber.eq(new BN(0));
    });

    it("_notVoter can not use getVoter()", async () => {
      await voting.addVoter(_owner, { from: _owner });
      await expectRevert(
        voting.getVoter(_owner, {
          from: _notVoter,
        }),
        "You're not a voter"
      );
    });

    it("only _owner can add a voter", async () => {
      await expectRevert(
        voting.addVoter(_voter2, { from: _voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("can't register two time a voter", async () => {
      await voting.addVoter(_voter1, { from: _owner });
      await expectRevert(
        voting.addVoter(_voter1, { from: _owner }),
        "Already registered"
      );
    });
  });

  //----------------------------------------------------------------------------------------
  //-----------------------       PROPOSALS REGISTRATIONS STARTED      ---------------------
  //----------------------------------------------------------------------------------------
  describe("ProposalsRegistrationStarted", () => {
    it("startProposalsRegistering() should emit WorkflowStatusChange event", async () => {
      const recipient = await voting.startProposalsRegistering({
        from: _owner,
      });

      expectEvent(recipient, _event.WorkflowStatusChange, {
        previousStatus: _workflowStatus.RegisteringVoters,
        newStatus: _workflowStatus.ProposalsRegistrationStarted,
      });
    });

    it("startProposalsRegistering() should change workflowStatus", async () => {
      await voting.startProposalsRegistering({
        from: _owner,
      });
      const status = await voting.workflowStatus.call({ from: _owner });

      expect(status).to.be.bignumber.eq(
        _workflowStatus.ProposalsRegistrationStarted
      );
    });

    it("should emit ProposalRegistered event", async () => {
      await voting.addVoter(_owner, { from: _owner });
      await voting.startProposalsRegistering({
        from: _owner,
      });
      const recipient = await voting.addProposal(_proposal1, {
        from: _owner,
      });

      // Proposal[0] is the GENESIS
      expectEvent(recipient, _event.ProposalRegistered, {
        proposalId: new BN(1),
      });
    });

    it("only owner can startProposalsRegistering()", async () => {
      await expectRevert(
        voting.startProposalsRegistering({
          from: _voter1,
        }),
        "Ownable: caller is not the owner"
      );
    });

    describe("After ProposalsRegistrationStarted", () => {
      beforeEach(async () => {
        await setVoters(voting, [_owner, _voter1, _voter2, _voter3], _owner);
        await voting.startProposalsRegistering({
          from: _owner,
        });
      });

      it("_voter1 can add a proposal", async () => {
        await voting.addProposal(_proposal1, {
          from: _voter1,
        });
        const { description, voteCount } = await voting.getOneProposal.call(
          new BN(1)
        );

        expect(description).to.be.eq(_proposal1);
        expect(voteCount).to.be.bignumber.eq(new BN(0));
      });

      it("_voter1 can add multiple proposals", async () => {
        await voting.addProposal(_proposal1, {
          from: _voter1,
        });
        await voting.addProposal(_proposal2, {
          from: _voter1,
        });
        await voting.addProposal(_proposal3, {
          from: _voter1,
        });

        const p1 = await voting.getOneProposal.call(new BN(1));
        expect(p1.description).to.be.eq(_proposal1);
        expect(p1.voteCount).to.be.bignumber.eq(new BN(0));

        const p2 = await voting.getOneProposal.call(new BN(2));
        expect(p2.description).to.be.eq(_proposal2);
        expect(p2.voteCount).to.be.bignumber.eq(new BN(0));

        const p3 = await voting.getOneProposal.call(new BN(3));
        expect(p3.description).to.be.eq(_proposal3);
        expect(p3.voteCount).to.be.bignumber.eq(new BN(0));
      });

      it("_notVoter can not use getOneProposal()", async () => {
        await voting.addProposal(_proposal1, {
          from: _voter1,
        });
        await expectRevert(
          voting.getOneProposal(new BN(1), {
            from: _notVoter,
          }),
          "You're not a voter"
        );
      });

      it("_notVoter can't add a proposal", async () => {
        const recipient = voting.addProposal(_proposal1, {
          from: _notVoter,
        });

        await expectRevert(recipient, "You're not a voter");
      });

      it("proposal can not be empty", async () => {
        const recipient = voting.addProposal("", {
          from: _voter1,
        });

        await expectRevert(recipient, "Vous ne pouvez pas ne rien proposer");
      });

      it("proposal[0] should be the genesis", async () => {
        const { description } = await voting.getOneProposal.call(new BN(0), {
          from: _voter1,
        });

        expect(description).to.be.eq("GENESIS");
      });
    });
  });

  //----------------------------------------------------------------------------------------
  //-----------------------       PROPOSALS REGISTRATIONS ENDED      -----------------------
  //----------------------------------------------------------------------------------------
  describe("ProposalsRegistrationEnded", () => {
    beforeEach(async () => {
      await setVoters(voting, [_owner, _voter1, _voter2, _voter3], _owner);

      await voting.startProposalsRegistering({
        from: _owner,
      });
      await voting.addProposal(_proposal1, {
        from: _voter1,
      });
    });

    it("endProposalsRegistering() should emit WorkflowStatusChange event", async () => {
      const recipient = await voting.endProposalsRegistering({
        from: _owner,
      });

      expectEvent(recipient, _event.WorkflowStatusChange, {
        previousStatus: _workflowStatus.ProposalsRegistrationStarted,
        newStatus: _workflowStatus.ProposalsRegistrationEnded,
      });
    });

    it("endProposalsRegistering() should change workflowStatus", async () => {
      await voting.endProposalsRegistering({
        from: _owner,
      });
      const status = await voting.workflowStatus.call({ from: _owner });

      expect(status).to.be.bignumber.eq(
        _workflowStatus.ProposalsRegistrationEnded
      );
    });

    it("only owner can endProposalsRegistering()", async () => {
      await expectRevert(
        voting.endProposalsRegistering({
          from: _voter1,
        }),
        "Ownable: caller is not the owner"
      );
    });
  });

  //----------------------------------------------------------------------------------------
  //-------------------------       VOTING SESSION STARTED      ----------------------------
  //----------------------------------------------------------------------------------------
  describe("VotingSessionStarted", () => {
    beforeEach(async () => {
      await setVoters(voting, [_owner, _voter1, _voter2, _voter3], _owner);

      await voting.startProposalsRegistering({
        from: _owner,
      });
      await voting.addProposal(_proposal1, {
        from: _voter1,
      });
      await voting.endProposalsRegistering({
        from: _owner,
      });
    });

    it("startVotingSession() should emit WorkflowStatusChange event", async () => {
      const recipient = await voting.startVotingSession({
        from: _owner,
      });

      expectEvent(recipient, _event.WorkflowStatusChange, {
        previousStatus: _workflowStatus.ProposalsRegistrationEnded,
        newStatus: _workflowStatus.VotingSessionStarted,
      });
    });

    it("startVotingSession() should change workflowStatus", async () => {
      await voting.startVotingSession({
        from: _owner,
      });
      const status = await voting.workflowStatus.call({ from: _owner });

      expect(status).to.be.bignumber.eq(_workflowStatus.VotingSessionStarted);
    });

    it("only owner can startVotingSession()", async () => {
      await expectRevert(
        voting.startVotingSession({
          from: _voter1,
        }),
        "Ownable: caller is not the owner"
      );
    });

    describe("After VotingSessionStarted", () => {
      beforeEach(async () => {
        await voting.startVotingSession({
          from: _owner,
        });
      });

      it("_voter1 can vote for proposal 1", async () => {
        await voting.setVote(new BN(1), {
          from: _voter1,
        });
        const { voteCount } = await voting.getOneProposal.call(new BN(1));

        expect(voteCount).to.be.bignumber.eq(new BN(1));
      });

      it("_voter1.hasVoted is true after vote", async () => {
        await voting.setVote(new BN(1), {
          from: _voter1,
        });
        const { hasVoted } = await voting.getVoter.call(_voter1);

        expect(hasVoted).to.be.true;
      });

      it("Can't vote twice", async () => {
        await voting.setVote(new BN(1), {
          from: _voter1,
        });
        const recipient = voting.setVote(new BN(1), {
          from: _voter1,
        });

        await expectRevert(recipient, "You have already voted");
      });

      it("revert on undefined proposal", async () => {
        const recipient = voting.setVote(new BN(100), {
          from: _voter1,
        });

        await expectRevert(recipient, "Proposal not found");
      });

      it("_notVoter can not setVote()", async () => {
        const recipient = voting.setVote(new BN(1), {
          from: _notVoter,
        });

        await expectRevert(recipient, "You're not a voter");
      });
    });
  });

  //----------------------------------------------------------------------------------------
  //-------------------------       VOTING SESSION ENDED      ------------------------------
  //----------------------------------------------------------------------------------------
  describe("VotingSessionEnded", () => {
    beforeEach(async () => {
      await setVoters(voting, [_owner, _voter1, _voter2, _voter3], _owner);
      await voting.startProposalsRegistering({
        from: _owner,
      });
      await voting.endProposalsRegistering({
        from: _owner,
      });
      await voting.startVotingSession({
        from: _owner,
      });
    });

    it("endVotingSession should emit WorkflowStatusChange event", async () => {
      const recipient = await voting.endVotingSession({
        from: _owner,
      });

      expectEvent(recipient, _event.WorkflowStatusChange, {
        previousStatus: _workflowStatus.VotingSessionStarted,
        newStatus: _workflowStatus.VotingSessionEnded,
      });
    });

    it("endVotingSession should change workflowStatus", async () => {
      await voting.endVotingSession({
        from: _owner,
      });
      const status = await voting.workflowStatus.call({ from: _owner });

      expect(status).to.be.bignumber.eq(_workflowStatus.VotingSessionEnded);
    });

    it("only owner can endVotingSession()", async () => {
      await expectRevert(
        voting.endVotingSession({
          from: _voter1,
        }),
        "Ownable: caller is not the owner"
      );
    });
  });

  //----------------------------------------------------------------------------------------
  //---------------------------         VOTES TALLIED       --------------------------------
  //----------------------------------------------------------------------------------------
  describe("VotesTallied", () => {
    beforeEach(async () => {
      await setVoters(voting, [_owner, _voter1, _voter2, _voter3], _owner);

      await voting.startProposalsRegistering({
        from: _owner,
      });
      await voting.addProposal(_proposal1, {
        from: _voter1,
      });
      await voting.addProposal(_proposal2, {
        from: _voter1,
      });
      await voting.addProposal(_proposal3, {
        from: _voter1,
      });
      await voting.endProposalsRegistering({
        from: _owner,
      });
      await voting.startVotingSession({
        from: _owner,
      });

      await voting.setVote(new BN(1), {
        from: _owner,
      });
      await voting.setVote(new BN(1), {
        from: _voter1,
      });
      await voting.setVote(new BN(2), {
        from: _voter2,
      });
      await voting.setVote(new BN(3), {
        from: _voter3,
      });

      await voting.endVotingSession({
        from: _owner,
      });
    });

    it("tallyVotes should emit WorkflowStatusChange.VotesTallied event", async () => {
      const recipient = await voting.tallyVotes({
        from: _owner,
      });

      expectEvent(recipient, _event.WorkflowStatusChange, {
        previousStatus: _workflowStatus.VotingSessionEnded,
        newStatus: _workflowStatus.VotesTallied,
      });
    });

    it("tallyVotes should change workflowStatus", async () => {
      await voting.tallyVotes({
        from: _owner,
      });
      const status = await voting.workflowStatus.call({ from: _owner });

      expect(status).to.be.bignumber.eq(_workflowStatus.VotesTallied);
    });

    it("only owner can tallyVotes()", async () => {
      await expectRevert(
        voting.tallyVotes({
          from: _voter1,
        }),
        "Ownable: caller is not the owner"
      );
    });

    it("tallyVotes should update winningProposalID with the winning proposal", async () => {
      await voting.tallyVotes({
        from: _owner,
      });
      const winningID = await voting.winningProposalID.call({
        from: _owner,
      });

      expect(winningID).to.be.bignumber.eq(new BN(1));
    });
  });
});
