'use strict';

const Tracker = artifacts.require('Tracker');

contract('Tracker::addStep', async () => {
    contract('Negative Tests', async () => {
        it('Reverts if _uuid is empty and msg.sender is not producer', async () => {
            let reason;

            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];
            const action = web3.utils.utf8ToHex('FISH_CAUGHT');
            const timestamp = web3.utils.utf8ToHex('2016-06-03T03:56:39Z');

            const tracker = await Tracker.new(producer);

            try {
                await tracker.addStep(
                    web3.utils.utf8ToHex(''),
                    action,
                    timestamp,
                );
            }
            catch (error) {
                reason = error.reason;
            }

            assert.strictEqual(
                reason,
                "_uuid does not exist",
            );
        });

        it('Reverts if _action is empty', async () => {
            let reason;

            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];
            // Hashing the UUID to ensure that the value is a valid bytes32
            // This is preferred over storing a string
            const uuid = web3.utils.soliditySha3('2bcfaca9-b287-4389-b325-4afdb9770024');
            const timestamp = web3.utils.utf8ToHex('2016-06-03T03:56:39Z');

            const tracker = await Tracker.new(producer);

            try {
                await tracker.addStep(
                    uuid,
                    web3.utils.utf8ToHex(''),
                    timestamp,
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
                "_action is empty",
            );
        });

        it('Reverts if _timestamp is empty', async () => {
            let reason;

            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];
            // Hashing the UUID to ensure that the value is a valid bytes32
            // This is preferred over storing a string
            const uuid = web3.utils.soliditySha3('2bcfaca9-b287-4389-b325-4afdb9770024');
            const action = web3.utils.utf8ToHex('FISH_CAUGHT');

            const tracker = await Tracker.new(producer);

            try {
                await tracker.addStep(
                    uuid,
                    action,
                    web3.utils.utf8ToHex(''),
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
                "_timestamp is empty",
            );
        });
    });

    contract('Storage', async () => {
        it('Successfully adds steps', async () => {
            let unpaddedAction;
            let unpaddedTimestamp;
            let action;
            let timestamp;
            let count;
            let step

            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];
            const packer = accounts[2];

            // Hashing the UUID to ensure that the value is a valid bytes32
            // This is preferred over storing a string
            const uuid = web3.utils.soliditySha3('2bcfaca9-b287-4389-b325-4afdb9770024');
            const tracker = await Tracker.new(producer);

            unpaddedAction = web3.utils.utf8ToHex('FISH_CAUGHT');
            unpaddedTimestamp = web3.utils.utf8ToHex('2016-06-03T03:56:39Z');

            // Add right pad to facilitate assertions
            action = web3.utils.padRight(unpaddedAction, 64);
            timestamp = web3.utils.padRight(unpaddedTimestamp, 64);

            // Producer initializes track by being the first to add a step
            await tracker.addStep(
                uuid,
                action,
                timestamp,
                {
                    from: producer,
                },
            );

            // Get the steps count for the given UUID
            count = (await tracker.tracks(uuid)).toNumber();

            assert.strictEqual(
                count,
                1,
            );

            // Get the step for the given UUID and the zeroth index
            step = await tracker.getStep(
                uuid,
                (count - 1),
            );

            assert.strictEqual(
                step.participant_,
                producer,
            );
            assert.strictEqual(
                step.action_,
                action,
            );
            assert.strictEqual(
                step.timestamp_,
                timestamp,
            );

            unpaddedAction = web3.utils.utf8ToHex('RECEIVED_IN_PACKAGING_FACILITY');
            unpaddedTimestamp = web3.utils.utf8ToHex('2016-06-07T06:25:20Z');

            // Add right pad to facilitate assertions
            action = web3.utils.padRight(unpaddedAction, 64);
            timestamp = web3.utils.padRight(unpaddedTimestamp, 64);

            // A different participant adds a step later
            await tracker.addStep(
                uuid,
                action,
                timestamp,
                {
                    from: packer,
                },
            );

            // Get the steps count for the given UUID
            count = (await tracker.tracks(uuid)).toNumber();

            assert.strictEqual(
                count,
                2,
            );

            // Get the step for the given UUID and the first index
            step = await tracker.getStep(
                uuid,
                (count - 1),
            );

            assert.strictEqual(
                step.participant_,
                packer,
            );
            assert.strictEqual(
                step.action_,
                action,
            );
            assert.strictEqual(
                step.timestamp_,
                timestamp,
            );
        });
    });
});
