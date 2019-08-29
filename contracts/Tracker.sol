pragma solidity ^0.5.11;


/**
 * @title Tracker.
 *
 * @notice Simple implementation for tracking participation by the producer and participants in a supply chain.
 */
contract Tracker {

    /* Storage */

    /** Address for producer, from whom trackables originate. */
    address public producer;

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
            "producer is zero"
        );

        producer = _producer;
    }
}