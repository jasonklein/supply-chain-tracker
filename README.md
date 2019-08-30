# Supply Chain Tracker

This is a simple implementation of a smart contract that can be used by participants in a supply chain to track items as they are moved along the chain. Doing so enables verification not only by participants, but also consumers and other interested parties.

## Deployment and Use

`Tracker.sol` has functions for adding and verifying tracking information. Certain functions, though public, are subject to access control.

### Storage

`producer`: address for producer, from whom trackables originate; has public getter

`isParticipant`: stores boolean flags indicating whether an address is a participant; has public getter

`tracks`: maps UUIDs to tracks; has a public getter that takes a trackable item's UUID and returns the steps count for the item's track


### Events

`ParticipantAdded`: emitted when a participant is added

`StepAdded`: emitted when a step, consisting of an action and a timestamp, is added to a track


### Functions

`constructor`: takes an address for setting `producer`

`addParticipant`: takes an address to flag as a participant; only `producer` can call

`addStep`: takes a UUID for a trackable item, action, and timestamp; only producer and participants can call; only producer can add the initial step for a track

`getStep`: takes a UUID for a trackable item and the index of a step and returns the participant that added the step, the action taken, and the timestamp

## Testing

To run tests

1. Install nodejs

2. Install npm packages:
```bash
$ npm install
```

3. Run tests:
```bash
$ npm test
```

## trace.js

trace.js will trace the histories of items tracked by a deployed Tracker instance.

It assumes the web3 provider is Infura and the contract is deployed on the Ropsten Ethereum network.

1. Set environmental variables:
```bash
$ export INFURA_PROJECT_ID=<INFURA_PROJECT_ID>
$ export TRACKER_ADDRESS=<address of deployed Tracker contract>
```

2. Trace items with UUIDs, provided as space-separated arguments.

```bash
$ node ./tools/trace.js <uuid 1> <uuid 2> <uuid n>
```

It will print the tracking information for the UUIDs obtained from the deployed Tracker contract, e.g.:
```
{ '2bcfaca9-b287-4389-b325-4afdb9770024':
   { count: '8',
     steps:
      [ { participant: '0xDae9FdE68869f72D407D0154A3Aa1518004DF703',
          action: 'FISH_CAUGHT',
          timestamp: '2016-06-03T03:56:39Z' },
        { participant: '0xDae9FdE68869f72D407D0154A3Aa1518004DF703',
          action: 'TRANSFERRED_TO_PACKAGING',
          timestamp: '2016-06-05T14:03:27Z' },
        { participant: '0x5b7401476e18DCc0914b742Ae6E75619F2745230',
          action: 'RECEIVED_IN_PACKAGING_FACILITY',
          timestamp: '2016-06-07T06:25:20Z' },
        { participant: '0x5b7401476e18DCc0914b742Ae6E75619F2745230',
          action: 'SENT_TO_DISTRIBUTER',
          timestamp: '2016-06-10T11:51:44Z' },
        { participant: '0x041e73A15884989481dE71D5B0A5d417e5c7327B',
          action: 'RECEIVED_BY_DISTRIBUTER',
          timestamp: '2016-06-12T11:00:02Z' },
        { participant: '0x041e73A15884989481dE71D5B0A5d417e5c7327B',
          action: 'SENT_TO_SUPERMARKET',
          timestamp: '2016-06-14T10:06:37Z' },
        { participant: '0xa63cfef4FA34093166517A2D4655d91F8404a2d3',
          action: 'RECEIVED_IN_SUPERMARKET',
          timestamp: '2016-06-16T04:29:14Z' },
        { participant: '0xa63cfef4FA34093166517A2D4655d91F8404a2d3',
          action: 'PURCHASED',
          timestamp: '2016-06-18T09:48:30Z' } ] } }
```

A Tracker instance is deployed on the Ropsten Ethereum Network, [0x8bae3ca85cc4b463e5854bcc5248b75512025a3c](https://ropsten.etherscan.io/address/0x8bae3ca85cc4b463e5854bcc5248b75512025a3c).
