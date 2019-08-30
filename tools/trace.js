'use strict';

const util = require('util');
const Web3 = require('web3');

// Set Web3 provider for interacting with a Ropsten Ethereum blockchain node
const web3 = new Web3(`https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const trackerAddress = process.env.TRACKER_ADDRESS;

let trackerJSON;
let tracks = {};

// Get UUIDs
const uuids = process.argv.slice(2);

// If no UUIDs provided, exit
if(uuids.length == 0) {
	console.log("No UUIDs provided, nothing to track.");
	process.exit();
}

// Read truffle build artefacts to access Tracker application binary interface (ABI)
try {
	trackerJSON = require('../build/contracts/Tracker.json');
}
catch (error) {
    if(error.code === 'MODULE_NOT_FOUND') {
    	console.log("Tracker.json not found. Please run `truffle compile`.");
    }
}

// Instantiate Web3 contract instance with Tracker ABI and deployed Tracker instance address
const tracker = new web3.eth.Contract(trackerJSON.abi, trackerAddress);

// Iteratively trace tracks for each UUID
const trace = async () => {
	for (const uuid of uuids) {
		const track = {};
		const uuidHash = web3.utils.soliditySha3(uuid);

		tracks[uuid] = track;
	    track.count = await tracker.methods.tracks(uuidHash).call()
		track.steps = [];

		for (let i = 0; i < track.count; i++) { 
		    const step = await tracker.methods.getStep(uuidHash, i).call();
		    track.steps.push({
				participant: step.participant_,
				action: web3.utils.hexToUtf8(step.action_),
				timestamp: web3.utils.hexToUtf8(step.timestamp_),
			});
		}
	}

	// Display tracks from trace
	console.log(util.inspect(tracks, false, null, true));
};

trace();
