import { ethers } from 'ethers';
import { config } from './config';
import { createMonitor } from './monitorFactory';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Starting Listening Bot...');
    console.log(`Mode: ${config.monitoringMode}`);
    console.log(`Contract: ${config.contractAddress}`);

    try {
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);

        // Load ABI
        const abiPath = path.resolve(__dirname, '../abi.json');
        const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

        const contract = new ethers.Contract(config.contractAddress, abi, provider);

        const monitor = createMonitor(contract);
        await monitor.start();

        // Keep process alive
        process.on('SIGINT', () => {
            console.log('Stopping bot...');
            monitor.stop();
            process.exit();
        });

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

main();
