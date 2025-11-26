import { PollingMonitor } from '../src/monitors/PollingMonitor';
import { EventMonitor } from '../src/monitors/EventMonitor';
import { bot } from '../src/bot';
import { config } from '../src/config';

// Mock config
config.stateVariableName = 'testVar';
config.pollIntervalMs = 100;
config.eventName = 'TestEvent';

// Mock Bot
bot.sendAlert = async (msg: string) => {
    console.log('[MOCK BOT] Sending Alert:', msg);
};

// Mock Contract
const mockContract: any = {
    value: 0,
    getFunction: (name: string) => {
        return async () => mockContract.value;
    },
    on: (event: string, cb: Function) => {
        console.log(`[MOCK CONTRACT] Listening for ${event}`);
        mockContract.listener = cb;
    },
    removeAllListeners: (event: string) => {
        console.log(`[MOCK CONTRACT] Removed listeners for ${event}`);
    },
    emit: (event: string, ...args: any[]) => {
        if (mockContract.listener) {
            mockContract.listener(...args, { log: { transactionHash: '0x123' } });
        }
    }
};

async function testPolling() {
    console.log('--- Testing PollingMonitor ---');
    const monitor = new PollingMonitor(mockContract);

    await monitor.start();

    // Simulate change
    setTimeout(() => {
        console.log('Simulating state change to 1');
        mockContract.value = 1;
    }, 200);

    setTimeout(() => {
        console.log('Simulating state change to 2');
        mockContract.value = 2;
    }, 400);

    setTimeout(() => {
        monitor.stop();
    }, 600);
}

async function testEvent() {
    console.log('\n--- Testing EventMonitor ---');
    const monitor = new EventMonitor(mockContract);

    await monitor.start();

    // Simulate event
    setTimeout(() => {
        console.log('Simulating event emission');
        mockContract.emit('TestEvent', 'arg1', 'arg2');
    }, 200);

    setTimeout(() => {
        monitor.stop();
    }, 400);
}

async function run() {
    await testPolling();
    setTimeout(async () => {
        await testEvent();
    }, 1000);
}

run();
