'use strict';

const Tracker = artifacts.require('Tracker');

contract('Tracker::addStep', async () => {
    contract('Negative Tests', async () => {
        it('Reverts if _uuid is empty', async () => {
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
                "_uuid is empty",
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
        it('Successfully adds a step', async () => {
            const accounts = await web3.eth.getAccounts();
            const producer = accounts[1];
            // Hashing the UUID to ensure that the value is a valid bytes32
            // This is preferred over storing a string
            const uuid = web3.utils.soliditySha3('2bcfaca9-b287-4389-b325-4afdb9770024');
            const action = web3.utils.utf8ToHex('FISH_CAUGHT');
            const timestamp = web3.utils.utf8ToHex('2016-06-03T03:56:39Z');
            const tracker = await Tracker.new(producer);

            await tracker.addStep(
                uuid,
                action,
                timestamp,
            );

            assert.strictEqual(
                (await tracker.tracks(uuid)).toNumber(),
                1,
            );
        });
    });
});