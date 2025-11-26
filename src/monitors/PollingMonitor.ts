import { ethers } from 'ethers';
import { MonitorStrategy } from './MonitorStrategy';
import { config } from '../config';
import { bot } from '../bot';

export class PollingMonitor implements MonitorStrategy {
    private contract: ethers.Contract;
    private intervalId: NodeJS.Timeout | null = null;
    private lastValue: any = null;

    constructor(contract: ethers.Contract) {
        this.contract = contract;
    }

    async start() {
        console.log(`Starting PollingMonitor for variable: ${config.stateVariableName}`);

        // Initial fetch
        try {
            this.lastValue = await this.fetchValue();
            console.log(`Initial value: ${this.lastValue}`);
        } catch (error) {
            console.error('Error fetching initial value:', error);
        }

        this.intervalId = setInterval(async () => {
            try {
                const currentValue = await this.fetchValue();

                if (this.lastValue !== null && currentValue.toString() !== this.lastValue.toString()) {
                    const message = `🚨 State Change Detected!\n\nVariable: ${config.stateVariableName}\nOld Value: ${this.lastValue}\nNew Value: ${currentValue}`;
                    await bot.sendAlert(message);
                    this.lastValue = currentValue;
                }
            } catch (error) {
                console.error('Error in polling loop:', error);
            }
        }, config.pollIntervalMs);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('PollingMonitor stopped');
        }
    }

    private async fetchValue(): Promise<any> {
        if (!config.stateVariableName) {
            throw new Error('State variable name is not configured');
        }
        // Assumes the variable has a public getter
        // Using getFunction to dynamically access the function
        const func = this.contract.getFunction(config.stateVariableName);
        if (!func) {
            throw new Error(`Function ${config.stateVariableName} not found in ABI`);
        }
        return await func();
    }
}
