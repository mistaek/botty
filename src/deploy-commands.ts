import { REST, type RESTPostAPIApplicationCommandsJSONBody, type RESTPostAPIApplicationGuildCommandsJSONBody, Routes } from 'discord.js';
import 'dotenv/config'
import { loadFolder } from './misc/utils.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const commandsPath = path.join(fileURLToPath(import.meta.url), '../commands');
const commandFiles = await loadFolder(commandsPath, ['data', 'execute']);
const commands: RESTPostAPIApplicationCommandsJSONBody[] | RESTPostAPIApplicationGuildCommandsJSONBody[] = [];

for(const command of commandFiles){
    commands.push(command.data.toJSON());
}
const rest = new REST().setToken(process.env.DISCORD_TOKEN || ''); 

(async () => {
    try{
        console.log(`Started refreshing ${commands.length} slash commands`);
        const data = await rest.put(
            Routes.applicationCommands(process.env.clientId || ''),
            {body: commands}
        );
        //register in guild too, seems faster
        /*const data2 = await rest.put(
            Routes.applicationGuildCommands(process.env.clientId || '', process.env.guildId || ''),
            {body: commands}
        );*/
    }
    catch(error) {
        console.error(error);
    }
})();