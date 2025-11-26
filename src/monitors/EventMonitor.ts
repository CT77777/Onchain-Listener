import { ethers } from 'ethers';
import { MonitorStrategy } from './MonitorStrategy';
import { config } from '../config';
import { bot } from '../bot';

export class EventMonitor implements MonitorStrategy {
    private contract: ethers.Contract;

    constructor(contract: ethers.Contract) {
        this.contract = contract;
    }

    async start() {
        if (!config.eventName) {
            throw new Error('Event name is not configured');
        }
        console.log(`Starting EventMonitor for event: ${config.eventName}`);

        // Setup listener
        // If we had filters, we would apply them here. 
        // Ethers v6 filter syntax might differ slightly but for general listening:
        this.contract.on(config.eventName, async (...args) => {
            // The last argument is the EventPayload, previous ones are event args
            const eventPayload = args[args.length - 1];
            // We can format the args nicely
            const relevantArgs = args.slice(0, args.length - 1);

            // Optional filtering if configured
            if (config.eventArgsFilter && config.eventArgsFilter.length > 0) {
                // Simple check: if filter is provided, check if args match
                // This is a naive implementation, real world might need more complex matching
                // For now, let's just log and alert everything
            }

            const message = `🔔 Event Detected!\n\nEvent: ${config.eventName}\nArgs: ${relevantArgs.join(', ')}\nTx Hash: ${eventPayload.log?.transactionHash}`;
            await bot.sendAlert(message);
        });
    }

    stop() {
        if (config.eventName) {
            this.contract.removeAllListeners(config.eventName);
            console.log('EventMonitor stopped');
        }
    }
}
