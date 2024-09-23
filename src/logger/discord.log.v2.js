'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const { TOKEN_DISCORD, CHANNEL_ID_DISCORD } = process.env

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        })

        // add channel id
        this.channelId = CHANNEL_ID_DISCORD;
        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}`);
        })
        this.client.login(TOKEN_DISCORD)
    }

    sendToFormartCode(logData) {
        const { code, message = 'content', title = 'Title' } = logData;
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' +  JSON.stringify(code , null, 2) + '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage);
    }

    sendToMessage(message = 'Hello') {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel)  {
            console.error('Channel not found');
            return;
        }
        // using chat GPT reply
        channel.send(message).catch(e => console.error(e))
    }
}

const loggerService = new LoggerService();

module.exports = new LoggerService()
