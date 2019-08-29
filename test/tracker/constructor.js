'use strict';

const Tracker = artifacts.require('Tracker');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('Tracker::constructor', async () => {
	contract('Negative Tests', async () => {
	    it('Reverts if _producer is zero', async () => {
	    	let reason;

	    	try {
				await Tracker.new(ZERO_ADDRESS);
	    	}
	    	catch (error) {
	    		reason = error.reason;
	    	}

			assert.strictEqual(
				reason,
				"_producer is zero",
			);
	    });
	});

	contract('Storage', async () => {
	    it('Successfully sets state variables', async () => {
			const accounts = await web3.eth.getAccounts();
			const producer = accounts[1];

	    	const tracker = await Tracker.new(producer);

			assert.strictEqual(
				await tracker.producer(),
				producer,
			);
	    });
	});
});