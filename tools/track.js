'use strict';

const Web3 = require('web3');

// Set Web3 provider for interacting with a Ropsten Ethereum blockchain node
const web3 = new Web3(`https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const trackerAddress = process.env.TRACKER_ADDRESS;

let trackerJSON;

try {
	// Read truffle build artefacts to access Tracker application binary interface (ABI)
	trackerJSON = require('../build/contracts/Tracker.json');
}
catch (error) {
    if(error.code === 'MODULE_NOT_FOUND') {
    	console.log("Tracker.json not found. Please run `truffle compile`.");
    }
}

// Instantiate Web3 contract instance with Tracker ABI and deployed Tracker instance address
const tracker = new web3.eth.Contract(trackerJSON.abi, trackerAddress);
