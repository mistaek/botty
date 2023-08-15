import * as path from 'path';
import { fileURLToPath } from 'url';
import { loadFolder } from '../misc/utils.js';

import {Client, Collection, GatewayIntentBits} from "discord.js";
import type {Command} from './command.js';
import type {Event} from './event.js';

export class ExtendedClient extends Client{
    public commands: Collection<string, Command>; 
    constructor(){
        super({
            intents: [GatewayIntentBits.Guilds]
        });
        this.commands = new Collection();
    }

    private async loadCommands(){
        const commandsPath = path.join(fileURLToPath(import.meta.url), '/../../commands');
        console.log(`Loading commands from ${commandsPath}`);
        const commandFiles: Command[] = await loadFolder(commandsPath, ['data', 'execute']);

        for (const command of commandFiles) {
            console.log(`Loaded command ${command.data.name}`);
            this.commands.set(command.data.name, command);
        }
    }

    private async loadEvents(){
        const eventsPath = path.join(fileURLToPath(import.meta.url), '/../../events');
        const eventFiles: Event[] =  await loadFolder(eventsPath, ['name', 'execute']);

        for(const event of eventFiles){
            this[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
            console.log(`Loaded event ${event.name}`);
        }
    }

    start(){
        this.loadCommands();
        this.loadEvents();
        this.login();
    }
}