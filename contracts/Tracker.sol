pragma solidity ^0.5.11;


/**
 * @title Tracker.
 *
 * @notice Simple implementation for tracking steps by the producer and participants
           in a supply chain for trackable items ("trackables").
 */
contract Tracker {

    /* Structs */

    /** Consists of a participant, an action, and the timestamp of that action was taken. */
    struct Step {
        address participant;
        bytes32 action;
        bytes32 timestamp;
    }

    /** Consists of steps and steps taken for a given trackable. */
    struct Track {
        uint256 count;
        Step[] steps;
    }


    /* Storage */

    /** Address for producer, from whom trackables originate. */
    address public producer;

    /** Flags whether an address is a participant. */
    mapping(address => bool) public isParticipant;

    /** Maps UUIDs to tracks. */
    mapping(bytes32 => Track) public tracks;


    /* Events */

    event ParticipantAdded(
        address indexed _participant
    );

    event StepAdded(
        address indexed _participant,
        bytes32 indexed _uuid,
        uint256 _count,
        bytes32 _action,
        bytes32 _timestamp
    );


    /* Modifiers */

    modifier onlyProducer() {
        require(
            msg.sender == producer,
            "msg.sender is not producer"
        );
        _;
    }

    modifier canParticipate() {
        require(
            isParticipant[msg.sender] || msg.sender == producer,
            "msg.sender cannot participate"
        );
        _;
    }

    /* Constructor */

    /**
     * @param _producer The value to which producer is set.
     */
    constructor(
        address _producer
    )
        public
    {
        require(
            address(_producer) != address(0),
            "_producer is zero"
        );

        producer = _producer;
    }


    /* External Functions */

    /**
     * @dev Adds participant.
     *
     * @param _participant Address of non-producer participant
     */
    function addParticipant(
        address _participant
    )
        public
        onlyProducer
    {
        require(
            address(_participant) != address(0),
            "_participant is zero"
        );

        isParticipant[_participant] = true;

        emit ParticipantAdded(_participant);
    }

    /**
     * @dev Adds step to a track.
     *
     * @param _uuid UUID of the trackable
     * @param _action Indicates what action was taken in the step
     * @param _timestamp Time at which _action was taken
     */
    function addStep(
        bytes32 _uuid,
        bytes32 _action,
        bytes32 _timestamp
    )
        public
        canParticipate
    {
        Track storage track = tracks[_uuid];

        require(
            track.count != 0 || msg.sender == producer,
            "_uuid does not exist"
        );
        require(
            _action != '',
            "_action is empty"
        );
        require(
            _timestamp != '',
            "_timestamp is empty"
        );

        track.count++;
        track.steps.push(
            Step(msg.sender, _action, _timestamp)
        );

        emit StepAdded(
            msg.sender,
            _uuid,
            track.count,
            _action,
            _timestamp
        );
    }

    /**
     * @dev Gets step from a track.
     *
     * @param _uuid UUID of the trackable
     * @param _index Index of step
     *
     * @return action_ and timestamp_ for step
     */
    function getStep(
        bytes32 _uuid,
        uint256 _index
    )
        public
        view
        returns(
            address participant_,
            bytes32 action_,
            bytes32 timestamp_
        )
    {
        Step memory step = tracks[_uuid].steps[_index];

        return(
            step.participant,
            step.action,
            step.timestamp
        );
    }
}