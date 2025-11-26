import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';

export class Bot {
    private bot: TelegramBot;

    constructor() {
        this.bot = new TelegramBot(config.telegramBotToken, { polling: false });
        console.log('Telegram bot initialized');
    }

    async sendAlert(message: string) {
        try {
            await this.bot.sendMessage(config.telegramChatId, message);
            console.log(`Alert sent: ${message}`);
        } catch (error) {
            console.error('Failed to send Telegram alert:', error);
        }
    }
}

export const bot = new Bot();
