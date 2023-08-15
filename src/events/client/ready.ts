import {Events, type Client} from 'discord.js';
import {Event} from '../../structs/event.js'

export default {
    name: Events.ClientReady,
    once: true, 
    execute(client: Client){
        console.log(`Ready! Logged in as ${client.user!.tag}`);
    }
} satisfies Event; 