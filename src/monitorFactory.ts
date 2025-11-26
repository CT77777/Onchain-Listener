import { ethers } from 'ethers';
import { config, MonitoringMode } from './config';
import { MonitorStrategy } from './monitors/MonitorStrategy';
import { PollingMonitor } from './monitors/PollingMonitor';
import { EventMonitor } from './monitors/EventMonitor';

export const createMonitor = (contract: ethers.Contract): MonitorStrategy => {
    switch (config.monitoringMode) {
        case MonitoringMode.POLL:
            return new PollingMonitor(contract);
        case MonitoringMode.EVENT:
            return new EventMonitor(contract);
        default:
            throw new Error(`Unsupported monitoring mode: ${config.monitoringMode}`);
    }
};
