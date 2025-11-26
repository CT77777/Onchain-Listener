export interface MonitorStrategy {
    start(): Promise<void>;
    stop(): void;
}
