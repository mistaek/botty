import {Client, Collection, GatewayIntentBits} from "discord.js";
import type {Command} from './command.js'

export class ExtendedClient extends Client{
    public commands: Collection<string, Command>; 
    constructor(){
        super({
            intents: [GatewayIntentBits.Guilds]
        });
        this.commands = new Collection();
    }

    start(){
        this.login();
    }
}