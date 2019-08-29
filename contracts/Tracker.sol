pragma solidity ^0.5.11;


/**
 * @title Tracker.
 *
 * @notice Simple implementation for tracking steps by the producer and participants
           in a supply chain for trackable items ("trackables").
 */
contract Tracker {

    /* Structs */

    /** Consists of an action and the timestamp of that action was taken. */
    struct Step {
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

    /** Maps UUIDs to tracks. */
    mapping(bytes32 => Track) public tracks;

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
    {
        require(
            _uuid != '',
            "_uuid is empty"
        );
        require(
            _action != '',
            "_action is empty"
        );
        require(
            _timestamp != '',
            "_timestamp is empty"
        );

        Track storage track = tracks[_uuid];
        track.count++;
        track.steps.push(
            Step(_action, _timestamp)
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
        returns (bytes32 action_, bytes32 timestamp_)
    {
        Step memory step = tracks[_uuid].steps[_index];

        return(
            step.action,
            step.timestamp
        );
    }
}