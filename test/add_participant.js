'use strict';

const Tracker = artifacts.require('Tracker');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('Tracker::addParticipant', async () => {
    contract('Negative Tests', async () => {
	    it('Reverts if msg.sender is not producer', async () => {
	    	let reason;

            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];

            const tracker = await Tracker.new(producer);

	    	try {
				await tracker.addParticipant(ZERO_ADDRESS);
	    	}
	    	catch (error) {
	    		reason = error.reason;
	    	}

			assert.strictEqual(
				reason,
				"msg.sender is not producer",
			);
	    });

	    it('Reverts if _participant is zero', async () => {
	    	let reason;

            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];

            const tracker = await Tracker.new(producer);

	    	try {
				await tracker.addParticipant(
					ZERO_ADDRESS,
					{
						from: producer,
					},
				);
	    	}
	    	catch (error) {
	    		reason = error.reason;
	    	}

			assert.strictEqual(
				reason,
				"_participant is zero",
			);
	    });
    });

    contract('Storage', async () => {
        it('Successfully adds a participant', async () => {
            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];
            const participant = accounts[2];

            const tracker = await Tracker.new(producer);

			await tracker.addParticipant(
				participant,
				{
					from: producer,
				},
			);

			assert.isTrue(
				await tracker.isParticipant(participant),
			);
		});
	});
});
