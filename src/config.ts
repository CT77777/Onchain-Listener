import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

export enum MonitoringMode {
    POLL = 'POLL',
    EVENT = 'EVENT',
}

interface Config {
    rpcUrl: string;
    contractAddress: string;
    telegramBotToken: string;
    telegramChatId: string;
    monitoringMode: MonitoringMode;
    // Poll specific
    stateVariableName?: string;
    pollIntervalMs: number;
    // Event specific
    eventName?: string;
    eventArgsFilter?: any[];
}

const getEnv = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value || '';
};

export const config: Config = {
    rpcUrl: getEnv('RPC_URL'),
    contractAddress: getEnv('CONTRACT_ADDRESS'),
    telegramBotToken: getEnv('TELEGRAM_BOT_TOKEN'),
    telegramChatId: getEnv('TELEGRAM_CHAT_ID'),
    monitoringMode: (getEnv('MONITORING_MODE', false) as MonitoringMode) || MonitoringMode.POLL,
    stateVariableName: getEnv('STATE_VARIABLE_NAME', false),
    pollIntervalMs: parseInt(getEnv('POLL_INTERVAL_MS', false) || '5000', 10),
    eventName: getEnv('EVENT_NAME', false),
    eventArgsFilter: process.env.EVENT_ARGS_FILTER ? JSON.parse(process.env.EVENT_ARGS_FILTER) : undefined,
};

// Validation based on mode
if (config.monitoringMode === MonitoringMode.POLL && !config.stateVariableName) {
    throw new Error('STATE_VARIABLE_NAME is required for POLL mode');
}
if (config.monitoringMode === MonitoringMode.EVENT && !config.eventName) {
    throw new Error('EVENT_NAME is required for EVENT mode');
}
