// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    enum WorkflowStatus {
        Registeringvoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }
    struct Proposal {
        string description;
        uint256 voteCount;
    }
    uint256 private winningProposalId;
    mapping(address => Voter) private voters; // voters are visible by voters
    mapping(string => uint256) public proposalIds; // description -> proposalId
    Proposal[] public proposals;
    WorkflowStatus public status;

    // ----------------------------------------------------- EVENTS
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    // ----------------------------------------------------- CONSTRUCTOR
    constructor() {
        status = WorkflowStatus.Registeringvoters;
        addVoter(msg.sender);
    }

    // ----------------------------------------------------- MODIFIERS
    modifier onlyVoter() {
        require(voters[msg.sender].isRegistered == true, "You are not a voter");
        _;
    }

    // ----------------------------------------------------- FUNCTIONS
    function getWinner() external view returns (uint256) {
        require(status == WorkflowStatus.VotesTallied, "The vote insn't done");
        return winningProposalId;
    }

    function getVoter(address _address)
        external
        view
        onlyVoter
        returns (
            bool isRegistered,
            bool hasVoted,
            uint256 votedProposalId
        )
    {
        isRegistered = voters[_address].isRegistered;
        hasVoted = voters[_address].hasVoted;
        votedProposalId = voters[_address].votedProposalId;
    }

    function addVoter(address _address) public onlyOwner {
        require(
            status == WorkflowStatus.Registeringvoters,
            "The current status don't allow you to add a Voter"
        );
        require(
            voters[_address].isRegistered == false,
            "This Voter already exists"
        );

        voters[_address] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedProposalId: 0
        });
        emit VoterRegistered(_address);
    }

    function addProposal(string calldata _description) external onlyVoter {
        require(
            status == WorkflowStatus.ProposalsRegistrationStarted,
            "The current status don't allow you to add a proposal"
        );
        require(
            bytes(_description).length > 0,
            "Empty description is not allowed"
        );

        if (proposals.length != 0) {
            require(
                !_isEmptyProposal(proposalIds[_description]),
                "This description already exists"
            );
        }

        proposals.push(Proposal(_description, 0));
        proposalIds[_description] = proposals.length - 1;
        emit ProposalRegistered(proposals.length - 1);
    }

    function vote(uint256 _proposalId) public onlyVoter {
        require(
            status == WorkflowStatus.VotingSessionStarted,
            "The current status don't allow you to vote"
        );
        require(voters[msg.sender].hasVoted == false, "You have already voted");
        require(
            _proposalId < proposals.length && !_isEmptyProposal(_proposalId),
            "This proposal does not exist"
        );

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    function winningProposal() external onlyOwner returns (uint256) {
        require(
            status == WorkflowStatus.VotingSessionEnded,
            "The current status don't allow this action"
        );

        winningProposalId = getMostVoted();
        _setStatus(WorkflowStatus.VotesTallied);
        return winningProposalId;
    }

    function getMostVoted() public view returns (uint256) {
        uint256 currentVoteCount = 0;
        uint256 currentProposal = 0;

        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > currentVoteCount) {
                currentVoteCount = proposals[p].voteCount;
                currentProposal = p;
            }
        }

        return currentProposal;
    }

    function incrementStatus() external onlyOwner {
        require(
            status != WorkflowStatus.VotingSessionEnded &&
                status != WorkflowStatus.VotesTallied,
            "You should run winningProposal() to close the vote"
        );
        _setStatus(WorkflowStatus(uint256(status) + 1));
    }

    function _setStatus(WorkflowStatus _status) private {
        status = _status;
        emit WorkflowStatusChange(WorkflowStatus(uint256(status) - 1), status);
    }

    function _isEmptyProposal(uint256 index) private view returns (bool) {
        return bytes(proposals[index].description).length == 0;
    }
}
