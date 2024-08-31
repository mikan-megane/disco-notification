import { GatewayIntentBits, Client, Partials, Events, type TextChannel } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Message, Partials.Channel],
})

client.once('ready', () => {
    console.log('Ready!')
    if (client.user) {
        console.log(client.user.tag)
    }
})

const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID as string
const TEXT_CHANNEL_ID = process.env.TEXT_CHANNEL_ID as string

let notificated = false

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.channelId === null && newState.channelId === VOICE_CHANNEL_ID) {
        if ((newState.channel?.members.size || 0) > 0 && !notificated) {
            const textChannel = client.channels.cache.get(TEXT_CHANNEL_ID) as TextChannel
            textChannel?.send("@everyone はじまるよー")
            notificated = true
        }
    }
    if (oldState.channelId === VOICE_CHANNEL_ID && newState.channelId === null) {
        if ((oldState.channel?.members.size || 0) === 0) {
            notificated = false
        }
    }
});

client.login(process.env.TOKEN)
